'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketNameEnv = process.env.CLOUDFLARE_R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketNameEnv) {
  console.warn('CRITICAL: Missing Cloudflare R2 Environment Variables!');
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

import { createClient } from '@/lib/supabase/server';

export async function uploadToR2(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, message: 'Unauthorized. You must be logged in to upload files.' };
    }

    const file = formData.get('file') as File;
    const pathFolder = formData.get('pathFolder') as string;

    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop-air';

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Assuming the bucket is publicly accessible at this R2.dev URL or custom domain
    // R2 public URL format: https://pub-<hash>.r2.dev or a custom domain.
    // For now, we will return the R2.dev format (requires bucket to be public)
    // Or if custom domain is set: https://cdn.worldstarhiphop.com/fileName
    
    // Cloudflare R2 default public buckets usually don't have a predictable URL unless custom domain is attached.
    // Assuming standard public bucket URL setup:
    const publicUrl = `https://pub-283e2da5eed64818e8d66be129764632.r2.dev/${fileName}`; 

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error uploading to R2:', error);
    return { success: false, message: error.message };
  }
}
