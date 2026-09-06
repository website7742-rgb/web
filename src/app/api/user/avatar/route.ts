import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for profile avatars

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to upload avatar' }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image format. Allowed: JPG, PNG, WEBP, GIF' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    if (fileBuffer.byteLength === 0) {
      return NextResponse.json({ error: 'Image file is empty' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const filename = `avatars/${user.id}/${uuidv4()}.${ext}`;
    let avatarUrl = '';

    const r2Client = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.CLOUDFLARE_BUCKET_NAME || 'worldstarhiphop';

    if (!r2Client) {
      console.error('[AvatarUpload] Cloudflare R2 credentials missing — cannot upload avatar.');
      return NextResponse.json({ error: 'Storage service not configured. Contact admin.' }, { status: 503 });
    }

    // ── UPLOAD TO CLOUDFLARE R2 (PRIMARY & ONLY PATH) ──
    console.log('[AvatarUpload] Uploading to Cloudflare R2 bucket:', bucketName, filename);

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000',
    });

    await r2Client.send(putObjectCommand);
    avatarUrl = `/api/avatar?key=${encodeURIComponent(filename)}`;


    // ── UPDATE SUPABASE PROFILES TABLE & RETRIEVE PREVIOUS AVATAR ──
    const adminSupabase = getAdminSupabase();

    // Fetch existing avatar to clean up old R2 file (orphan management)
    let previousAvatarUrl: string | null = null;
    try {
      const { data: existingProf } = await adminSupabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      if (existingProf?.avatar_url) {
        previousAvatarUrl = existingProf.avatar_url;
      }
    } catch {
      // Non-blocking fetch
    }

    const { error: dbError } = await adminSupabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (dbError) {
      console.error('[AvatarUpload] Database update error:', dbError);
      return NextResponse.json({ error: 'Failed to update user profile in database' }, { status: 500 });
    }

    // ── CLEAN UP PREVIOUS AVATAR OBJECT FROM R2 IF IT BELONGS TO THIS USER ──
    if (previousAvatarUrl) {
      try {
        let oldKey: string | null = null;
        if (previousAvatarUrl.includes('/api/avatar?key=')) {
          const parsed = new URL(previousAvatarUrl, 'http://localhost');
          const k = parsed.searchParams.get('key');
          if (k && k.startsWith(`avatars/${user.id}/`)) {
            oldKey = k;
          }
        } else if (previousAvatarUrl.includes(`avatars/${user.id}/`)) {
          const idx = previousAvatarUrl.indexOf(`avatars/${user.id}/`);
          if (idx !== -1) {
            oldKey = previousAvatarUrl.slice(idx).split('?')[0];
          }
        }

        if (oldKey && oldKey !== filename) {
          await r2Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: oldKey,
          }));
          console.log('[AvatarUpload] Pruned replaced avatar object from R2:', oldKey);
        }
      } catch (cleanupErr) {
        console.warn('[AvatarUpload] Non-blocking avatar cleanup warning:', cleanupErr);
      }
    }

    // ── ALSO SYNC TO SUPABASE AUTH USER_METADATA FOR INSTANT CROSS-DEVICE HYDRATION ──
    try {
      await adminSupabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(user.user_metadata || {}),
          avatar_url: avatarUrl,
        },
      });
    } catch (metaErr) {
      console.warn('[AvatarUpload] Auth metadata sync warning:', metaErr);
    }

    // Revalidate Next.js cache across all routes
    revalidatePath('/profile');
    revalidatePath('/settings');
    revalidatePath('/roster');
    revalidatePath('/admin');
    revalidatePath('/admin/users');

    return NextResponse.json({
      success: true,
      avatar_url: avatarUrl,
      storage: 'cloudflare_r2',
      message: 'Profile picture updated successfully!',
    });
  } catch (err: any) {
    console.error('[AvatarUpload] Exception:', err);
    return NextResponse.json({ error: err.message || 'Server error uploading avatar' }, { status: 500 });
  }
}
