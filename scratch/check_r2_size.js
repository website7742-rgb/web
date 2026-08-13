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

async function checkR2Storage() {
  const env = getEnvVars();
  const r2AccountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
  const r2AccessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const r2BucketName = env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';

  if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
    console.error("Missing Cloudflare R2 credentials in .env.local");
    process.exit(1);
  }

  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  let totalSize = 0;
  let objectCount = 0;
  let isTruncated = true;
  let continuationToken = undefined;

  console.log(`Checking storage for bucket: ${r2BucketName}...`);

  try {
    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: r2BucketName,
        ContinuationToken: continuationToken,
      });

      const response = await r2Client.send(command);

      if (response.Contents) {
        for (const item of response.Contents) {
          totalSize += item.Size || 0;
          objectCount++;
        }
      }

      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }

    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    const sizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);

    console.log(`\n=== Cloudflare R2 Storage Usage ===`);
    console.log(`Total Objects: ${objectCount}`);
    console.log(`Total Size: ${sizeInMB} MB (${sizeInGB} GB)`);
    console.log(`===================================`);

  } catch (err) {
    console.error("Error accessing R2 bucket:", err.message);
  }
}

checkR2Storage();
