const https = require('https');
const fs = require('fs');
const path = require('path');

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

async function main() {
  const env = getEnvVars();
  const token = env.SUPABASE_PERSONAL_ACCESS_TOKEN;
  const projectRef = 'krnsfelxtkpsiueuovwp';

  console.log('Inspecting Supabase project tables via Management API...');

  const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/api/rest`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  // Run SQL to get tables and columns in public schema
  const sql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;

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
      console.log('SQL Query Response:', data);
    });
  });

  req.write(JSON.stringify({ query: sql }));
  req.end();
}

main();
