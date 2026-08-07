import { NextResponse } from 'next/server';
import { addMedia } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally under public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file to filesystem
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${filename}`;

    // Add to Media DB
    const mediaItem = await addMedia({
      filename: file.name,
      url: relativeUrl,
      size: file.size,
      mime_type: file.type
    });

    return NextResponse.json(mediaItem);
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
