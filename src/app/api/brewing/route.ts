import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBrewingContent, saveBrewingContent } from '@/lib/db';

export async function GET() {
  try {
    const content = await getBrewingContent();
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveBrewingContent(body);
    try {
      revalidatePath('/', 'page');
    } catch (e) {}
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

