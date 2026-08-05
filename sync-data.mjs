import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
const envRaw = fs.readFileSync('.env.local', 'utf8');
const env = {};
envRaw.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching artists from Supabase...');
  const { data, error } = await supabase.from('artists').select('*');
  
  if (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
  
  console.log(`Fetched ${data.length} artists from Supabase.`);
  fs.writeFileSync('src/lib/data/supabase_artists_dump.json', JSON.stringify(data, null, 2));
  console.log('Saved to src/lib/data/supabase_artists_dump.json');
}

run();
