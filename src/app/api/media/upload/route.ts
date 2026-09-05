import { NextResponse } from 'next/server';
import { addMedia, isSupabaseConfigured, supabase } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
  'audio/x-m4a'
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB max

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'General';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    // Determine MIME and extension
    const mimeType = file.type || 'application/octet-stream';
    const isAllowed = ALLOWED_MIME_TYPES.some(m => mimeType.includes(m) || m.includes(mimeType));
    if (!isAllowed && !mimeType.startsWith('image/') && !mimeType.startsWith('audio/')) {
      return NextResponse.json({ error: 'Invalid file type. Only image and audio files are supported.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${cleanName}`;

    let fileUrl = '';

    // 1. Try Supabase Storage if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('media')
          .upload(`uploads/${filename}`, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(`uploads/${filename}`);
          fileUrl = publicUrlData.publicUrl;
        } else {
          console.warn('Supabase storage upload failed, using local storage fallback:', error);
        }
      } catch (err) {
        console.warn('Supabase storage exception, using local storage fallback:', err);
      }
    }

    // 2. Local public/uploads fallback
    if (!fileUrl) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    }

    // 3. Register in Media DB
    const mediaItem = await addMedia({
      filename: file.name,
      url: fileUrl,
      size: file.size,
      mime_type: mimeType,
      category: category
    });

    return NextResponse.json(mediaItem);
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
