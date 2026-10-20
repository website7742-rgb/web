import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  S3Client, 
  CreateMultipartUploadCommand, 
  UploadPartCommand, 
  CompleteMultipartUploadCommand, 
  AbortMultipartUploadCommand, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

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

async function verifyAuth(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return true;

  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  const adminCookie = cookieStore.get('wshh_admin_session')?.value;
  return adminCookie === 'authenticated';
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

interface UploadManifest {
  sessionId: string;
  targetKey: string;
  uploadId: string;
  totalChunks: number;
  pendingChunk: number | null;
  partNumber: number;
  parts: Array<{ PartNumber: number; ETag: string }>;
}

export async function POST(request: Request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'init';
    const { client, bucketName } = getR2Client();

    // 1. ACTION: INIT
    if (action === 'init') {
      const body = await request.json();
      const { fileName, fileType, folder = 'videos', totalChunks = 1 } = body;

      const cleanFolder = (folder as string).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || 'videos';
      const rawExt = (fileName as string)?.split('.').pop()?.toLowerCase() || 'mp4';
      const ext = rawExt.replace(/[^a-z0-9]/g, '').slice(0, 10) || 'mp4';
      const uniqueKey = `${cleanFolder}/${Date.now()}_${uuidv4().slice(0, 8)}.${ext}`;
      const sessionId = `sess_${Date.now()}_${uuidv4().slice(0, 8)}`;

      const mpRes = await client.send(
        new CreateMultipartUploadCommand({
          Bucket: bucketName,
          Key: uniqueKey,
          ContentType: fileType || 'video/mp4',
        })
      );

      const manifest: UploadManifest = {
        sessionId,
        targetKey: uniqueKey,
        uploadId: mpRes.UploadId || '',
        totalChunks: Number(totalChunks),
        pendingChunk: null,
        partNumber: 1,
        parts: [],
      };

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `temp-chunks/${sessionId}/manifest.json`,
          Body: Buffer.from(JSON.stringify(manifest), 'utf-8'),
          ContentType: 'application/json',
        })
      );

      return NextResponse.json({
        success: true,
        sessionId,
        targetKey: uniqueKey,
      });
    }

    // 2. ACTION: PART
    if (action === 'part') {
      const formData = await request.formData();
      const sessionId = formData.get('sessionId') as string;
      const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
      const chunkFile = formData.get('chunk') as File | null;

      if (!sessionId || isNaN(chunkIndex) || !chunkFile) {
        return NextResponse.json({ error: 'Missing sessionId, chunkIndex, or chunk file' }, { status: 400 });
      }

      // Read manifest
      const manifestObj = await client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: `temp-chunks/${sessionId}/manifest.json`,
        })
      );
      const manifest: UploadManifest = JSON.parse(
        (await streamToBuffer(manifestObj.Body)).toString('utf-8')
      );

      const chunkBuffer = Buffer.from(await chunkFile.arrayBuffer());
      const isLast = chunkIndex === manifest.totalChunks - 1;

      if (manifest.pendingChunk === null) {
        if (isLast) {
          // Final single chunk - upload directly as final part (any size permitted for final part)
          const upRes = await client.send(
            new UploadPartCommand({
              Bucket: bucketName,
              Key: manifest.targetKey,
              UploadId: manifest.uploadId,
              PartNumber: manifest.partNumber,
              Body: chunkBuffer,
            })
          );
          if (upRes.ETag) {
            manifest.parts.push({ PartNumber: manifest.partNumber, ETag: upRes.ETag });
          }
        } else {
          // Store chunk to pair with next chunk and meet S3 5MB minimum part size
          await client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: `temp-chunks/${sessionId}/${chunkIndex}`,
              Body: chunkBuffer,
            })
          );
          manifest.pendingChunk = chunkIndex;
        }
      } else {
        // Retrieve stored pending chunk and merge
        const prevKey = `temp-chunks/${sessionId}/${manifest.pendingChunk}`;
        const prevObj = await client.send(
          new GetObjectCommand({
            Bucket: bucketName,
            Key: prevKey,
          })
        );
        const prevBuffer = await streamToBuffer(prevObj.Body);

        const merged = Buffer.concat([prevBuffer, chunkBuffer]);
        const upRes = await client.send(
          new UploadPartCommand({
            Bucket: bucketName,
            Key: manifest.targetKey,
            UploadId: manifest.uploadId,
            PartNumber: manifest.partNumber,
            Body: merged,
          })
        );

        if (upRes.ETag) {
          manifest.parts.push({ PartNumber: manifest.partNumber, ETag: upRes.ETag });
        }
        manifest.partNumber++;
        manifest.pendingChunk = null;

        // Cleanup pending chunk in background
        client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: prevKey })).catch(() => {});
      }

      // Save updated manifest
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `temp-chunks/${sessionId}/manifest.json`,
          Body: Buffer.from(JSON.stringify(manifest), 'utf-8'),
          ContentType: 'application/json',
        })
      );

      return NextResponse.json({
        success: true,
        chunkIndex,
        partsCount: manifest.parts.length,
      });
    }

    // 3. ACTION: COMPLETE
    if (action === 'complete') {
      const body = await request.json();
      const { sessionId } = body;
      if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
      }

      const manifestObj = await client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: `temp-chunks/${sessionId}/manifest.json`,
        })
      );
      const manifest: UploadManifest = JSON.parse(
        (await streamToBuffer(manifestObj.Body)).toString('utf-8')
      );

      // Handle any leftover pending chunk
      if (manifest.pendingChunk !== null) {
        const prevKey = `temp-chunks/${sessionId}/${manifest.pendingChunk}`;
        const prevObj = await client.send(
          new GetObjectCommand({
            Bucket: bucketName,
            Key: prevKey,
          })
        );
        const prevBuffer = await streamToBuffer(prevObj.Body);

        const upRes = await client.send(
          new UploadPartCommand({
            Bucket: bucketName,
            Key: manifest.targetKey,
            UploadId: manifest.uploadId,
            PartNumber: manifest.partNumber,
            Body: prevBuffer,
          })
        );

        if (upRes.ETag) {
          manifest.parts.push({ PartNumber: manifest.partNumber, ETag: upRes.ETag });
        }
        client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: prevKey })).catch(() => {});
      }

      // Complete Multipart Upload on Cloudflare R2
      await client.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucketName,
          Key: manifest.targetKey,
          UploadId: manifest.uploadId,
          MultipartUpload: { Parts: manifest.parts },
        })
      );

      // Clean up manifest
      client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: `temp-chunks/${sessionId}/manifest.json`,
        })
      ).catch(() => {});

      const publicBase = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL 
        ? process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, '')
        : 'https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev';

      const publicUrl = `${publicBase}/${manifest.targetKey}`;

      return NextResponse.json({
        success: true,
        publicUrl,
        key: manifest.targetKey,
      });
    }

    // 4. ACTION: ABORT
    if (action === 'abort') {
      const body = await request.json();
      const { sessionId } = body;
      if (sessionId) {
        try {
          const manifestObj = await client.send(
            new GetObjectCommand({
              Bucket: bucketName,
              Key: `temp-chunks/${sessionId}/manifest.json`,
            })
          );
          const manifest: UploadManifest = JSON.parse(
            (await streamToBuffer(manifestObj.Body)).toString('utf-8')
          );
          await client.send(
            new AbortMultipartUploadCommand({
              Bucket: bucketName,
              Key: manifest.targetKey,
              UploadId: manifest.uploadId,
            })
          );
          await client.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: `temp-chunks/${sessionId}/manifest.json`,
            })
          );
        } catch (_) {}
      }
      return NextResponse.json({ success: true, aborted: true });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error('[/api/upload/chunk] Error:', err);
    return NextResponse.json({ error: err.message || 'Chunk pipeline error' }, { status: 500 });
  }
}
