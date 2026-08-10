/**
 * auto_migrate_to_r2.js
 * 
 * Server-side migration script:
 * 1. Downloads 'stress_test_1785905296150.mp4' from Supabase Storage (user_submissions bucket)
 * 2. Streams it directly into memory
 * 3. Uploads it to Cloudflare R2
 * 4. Deletes the original from Supabase Storage
 */

const { createClient } = require(require('path').join(process.cwd(), 'node_modules', '@supabase', 'supabase-js'));
const { S3Client, PutObjectCommand, HeadObjectCommand } = require(require('path').join(process.cwd(), 'node_modules', '@aws-sdk', 'client-s3'));
const fs = require('fs');
const path = require('path');
const https = require('https');

function getEnvVars() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      env[line.slice(0, eqIdx).trim()] = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        downloadUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} downloading file`));
        return;
      }
      const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
      let downloadedBytes = 0;
      
      res.on('data', chunk => {
        chunks.push(chunk);
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\r  Downloading... ${pct}% (${(downloadedBytes / 1024 / 1024).toFixed(1)}MB / ${(totalBytes / 1024 / 1024).toFixed(1)}MB)`);
        }
      });
      res.on('end', () => {
        process.stdout.write('\n');
        resolve(Buffer.concat(chunks));
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const env = getEnvVars();

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const r2AccountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
  const r2AccessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const r2BucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';

  const FILE_NAME = 'stress_test_1785905296150.mp4';
  const SUPABASE_BUCKET = 'user_submissions';
  const R2_TARGET_KEY = `media/${FILE_NAME}`;

  console.log('\n🚀 ===== SUPABASE → CLOUDFLARE R2 MIGRATION =====\n');
  console.log(`File:     ${FILE_NAME}`);
  console.log(`Source:   Supabase Storage → ${SUPABASE_BUCKET}`);
  console.log(`Target:   Cloudflare R2 → ${r2BucketName}/${R2_TARGET_KEY}\n`);

  // --- STEP 1: Initialize clients ---
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  // --- STEP 2: Get public URL from Supabase ---
  console.log('📥 STEP 1: Getting download URL from Supabase...');
  const { data: urlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(FILE_NAME);

  const downloadURL = urlData.publicUrl;
  console.log(`   URL: ${downloadURL}\n`);

  // --- STEP 3: Download file into memory buffer ---
  console.log('⬇️  STEP 2: Downloading file from Supabase into memory...');
  let fileBuffer;
  try {
    fileBuffer = await downloadUrl(downloadURL);
    console.log(`   ✅ Downloaded: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB\n`);
  } catch (err) {
    console.error(`   ❌ Download failed: ${err.message}`);
    process.exit(1);
  }

  // --- STEP 4: Upload buffer to Cloudflare R2 ---
  console.log('☁️  STEP 3: Uploading to Cloudflare R2...');
  try {
    const putCmd = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: R2_TARGET_KEY,
      Body: fileBuffer,
      ContentType: 'video/mp4',
      ContentLength: fileBuffer.length,
    });
    await r2Client.send(putCmd);

    const r2PublicUrl = `https://pub-${r2AccountId}.r2.dev/${R2_TARGET_KEY}`;
    console.log(`   ✅ Uploaded to R2!`);
    console.log(`   📌 R2 Public URL: ${r2PublicUrl}\n`);
  } catch (err) {
    console.error(`   ❌ R2 Upload failed: ${err.message}`);
    process.exit(1);
  }

  // --- STEP 5: Delete original from Supabase Storage ---
  console.log('🗑️  STEP 4: Deleting original from Supabase Storage...');
  const { error: deleteError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .remove([FILE_NAME]);

  if (deleteError) {
    console.warn(`   ⚠️  Delete warning (file may already be gone): ${deleteError.message}`);
  } else {
    console.log(`   ✅ Deleted from Supabase Storage!\n`);
  }

  // --- DONE ---
  const r2PublicUrl = `https://pub-${r2AccountId}.r2.dev/${R2_TARGET_KEY}`;
  console.log('🎉 ===== MIGRATION COMPLETE =====');
  console.log(`✅ File is now live on Cloudflare R2:`);
  console.log(`   ${r2PublicUrl}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
