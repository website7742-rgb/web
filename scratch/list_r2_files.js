const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

async function listR2Files() {
  const env = getEnvVars();
  const r2AccountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
  const r2AccessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const r2BucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';

  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  let isTruncated = true;
  let continuationToken = undefined;
  
  console.log(`\n=== Links for files in Cloudflare R2 ===`);

  try {
    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: r2BucketName,
        ContinuationToken: continuationToken,
      });

      const response = await r2Client.send(command);

      if (response.Contents) {
        for (const item of response.Contents) {
          const publicUrl = `https://pub-${r2AccountId}.r2.dev/${item.Key}`;
          console.log(`- ${item.Key} (${(item.Size / 1024 / 1024).toFixed(2)} MB)`);
          console.log(`  🔗 ${publicUrl}`);
        }
      }

      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }
    console.log(`========================================\n`);
  } catch (err) {
    console.error("Error accessing R2 bucket:", err.message);
  }
}

listR2Files();
