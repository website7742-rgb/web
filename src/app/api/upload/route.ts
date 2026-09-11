import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'audio/mpeg', 'audio/wav',
  'video/mp4', 'video/webm', 'video/quicktime'
];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function getR2Client() {
  const accountId       = process.env.CLOUDFLARE_R2_ACCOUNT_ID       || '283e2da5eed64818e8d66be129764632';
  const accessKeyId     = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID     || '';
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  const bucketName      = process.env.CLOUDFLARE_R2_BUCKET_NAME       || 'worldstarhiphop';

  return {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    accountId,
    bucketName,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    let isAdmin = false;
    try {
      const { data: rpcIsAdmin } = await supabase.rpc('is_admin');
      if (rpcIsAdmin) isAdmin = true;
    } catch {}

    if (!isAdmin && user.email) {
      const KNOWN_ADMIN_EMAILS = [
        'armyking1428@gmail.com',
        'admin@wshh.com',
        'website7742@gmail.com',
        'admin@worldstarhiphop.world',
      ];
      if (KNOWN_ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid request payload or missing form data' }, { status: 400 });
    }

    const file   = formData.get('file') as File | null;
    const rawFolder = ((formData.get('folder') as string) || 'admin-uploads').trim();
    const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'admin-uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 500MB limit.' }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
    }

    // Build unique key
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const ext = rawExt.replace(/[^a-z0-9]/g, '').slice(0, 10) || 'bin';
    const uniqueKey = `${folder}/${uuidv4()}.${ext}`;

    // Upload to Cloudflare R2
    const { client, accountId, bucketName } = getR2Client();
    await client.send(new PutObjectCommand({
      Bucket:        bucketName,
      Key:           uniqueKey,
      Body:          buffer,
      ContentType:   file.type,
      ContentLength: buffer.byteLength,
    }));

    const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL 
      ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${uniqueKey}` 
      : `https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev/${uniqueKey}`;

    return NextResponse.json({ success: true, url: publicUrl, path: publicUrl });
  } catch (err) {
    console.error('[/api/upload] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
