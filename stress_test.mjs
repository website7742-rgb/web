import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  const videoPath = 'E:\\winddosfiles\\for my\\video\\nKVr8eEZRVbS.mp4';
  console.log('1. Reading file from local disk:', videoPath);

  if (!fs.existsSync(videoPath)) {
    console.error('File not found:', videoPath);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(videoPath);
  const fileName = `stress_test_${Date.now()}.mp4`;

  console.log('2. Uploading file to Supabase...');
  
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Available buckets:', buckets?.map(b => b.name) || []);
  
  if (!buckets?.find(b => b.name === 'user_submissions')) {
    console.log('Creating user_submissions bucket...');
    await supabase.storage.createBucket('user_submissions', { public: true });
  }

  const { data, error: uploadError } = await supabase.storage
    .from('user_submissions')
    .upload(fileName, fileBuffer, {
      contentType: 'video/mp4',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    process.exit(1);
  }

  const publicUrl = supabase.storage.from('user_submissions').getPublicUrl(fileName).data.publicUrl;
  console.log('Uploaded asset public URL:', publicUrl);

  console.log('3. Injecting database payload...');
  const { error: dbError } = await supabase
    .from('demo_submissions')
    .insert([
      {
        artist_name: "AUTOPILOT_PIPELINE_STRESS_TEST",
        email: "autopilot@system.test",
        track_title: "Submission",
        genre: "Electronic",
        audio_url: "https://krnsfelxtkpsiueuovwp.supabase.co/storage/v1/object/public/user_submissions/test.mp3",
        video_url: publicUrl,
        bio_notes: "Automated pipeline integrity check."
      }
    ]);

  if (dbError) {
    console.error('DB Insert Error:', dbError);
    process.exit(1);
  }

  console.log('SUCCESS: Pipeline stress test completed. Asset token is live.');
}

runTest();
