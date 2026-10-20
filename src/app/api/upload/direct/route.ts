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

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '283e2da5eed64818e8d66be129764632';
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';

  return {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    bucketName,
  };
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Check admin session cookies as fallback
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      const adminCookie = cookieStore.get('wshh_admin_session')?.value;
      if (adminCookie !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'videos';

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const fileType = file.type || 'video/mp4';
    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return NextResponse.json({ error: `Unsupported file type: ${fileType}` }, { status: 400 });
    }

    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'videos';
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const ext = rawExt.replace(/[^a-z0-9]/g, '').slice(0, 10) || 'mp4';
    const uniqueKey = `${cleanFolder}/${Date.now()}_${uuidv4().slice(0, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { client, bucketName } = getR2Client();

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueKey,
        Body: buffer,
        ContentType: fileType,
      })
    );

    const publicBase = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL 
      ? process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, '')
      : 'https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev';

    const publicUrl = `${publicBase}/${uniqueKey}`;

    return NextResponse.json({
      success: true,
      publicUrl,
      key: uniqueKey,
    });
  } catch (err: any) {
    console.error('[/api/upload/direct] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
