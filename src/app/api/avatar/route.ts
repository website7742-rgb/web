import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return new NextResponse('Missing image key', { status: 400 });
    }

    const r2Client = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.CLOUDFLARE_BUCKET_NAME || 'worldstarhiphop';

    if (!r2Client) {
      return new NextResponse('Storage unavailable', { status: 500 });
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const s3Object = await r2Client.send(command);

    if (!s3Object.Body) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Convert S3 ReadableStream to Buffer for Web Response
    const byteArray = await s3Object.Body.transformToByteArray();
    const buffer = Buffer.from(byteArray);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': s3Object.ContentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': s3Object.ContentLength?.toString() || buffer.byteLength.toString(),
      },
    });
  } catch (err: any) {
    console.error('[AvatarProxyError]', err);
    return new NextResponse('Avatar image error', { status: 404 });
  }
}
