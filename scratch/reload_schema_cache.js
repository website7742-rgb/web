const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function getEnvVars() {
  const envPath = path.join(process.cwd(), '.env.local');
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

function runSql(sql, token, projectRef = 'krnsfelxtkpsiueuovwp') {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

async function main() {
  const env = getEnvVars();
  const token = env.SUPABASE_PERSONAL_ACCESS_TOKEN;
  const projectRef = 'krnsfelxtkpsiueuovwp';

  console.log('Sending NOTIFY pgrst, reload schema to Supabase...');
  const res = await runSql("NOTIFY pgrst, 'reload schema';", token, projectRef);
  console.log('Reload schema result:', res);

  console.log('Waiting 2 seconds...');
  await new Promise(r => setTimeout(r, 2000));

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.from('videos').select('count', { count: 'exact' });
  if (error) {
    console.error('Error selecting from videos table:', error.message);
  } else {
    console.log('Success! Table "videos" is accessible via Supabase client!', data);
  }
}

main();
