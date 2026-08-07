import { NextResponse } from 'next/server';
import { getHomepageContent, saveHomepageContent } from '@/lib/db';

export async function GET() {
  try {
    const content = await getHomepageContent();
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, content } = await request.json();
    if (!key || !content) {
      return NextResponse.json({ error: 'Missing section key or content' }, { status: 400 });
    }
    const saved = await saveHomepageContent(key, content);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
