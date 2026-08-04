import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 
  'application/pdf', 
  'audio/mpeg', 'audio/wav',
  'video/mp4', 'video/webm', 'video/quicktime'
];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB max limit for enterprise video assets

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Verify admin access for 'media' bucket uploads
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin');
    if (adminCheckError || !isAdmin) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid request payload or missing form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string || 'media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, PDF, MP3, WAV allowed.' }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    // 3. Randomize Filename to prevent path traversal and collision
    const ext = file.name.split('.').pop()?.toLowerCase();
    const safeFilename = `${uuidv4()}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(safeFilename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage Upload Error:', error);
      return NextResponse.json({ error: 'Failed to upload to storage.' }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    // Track in media_assets table
    await supabase.from('media_assets').insert({
      file_name: file.name,
      file_path: data.path,
      mime_type: file.type,
      size_bytes: file.size,
      bucket_id: bucket
    });

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl, path: data.path });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
