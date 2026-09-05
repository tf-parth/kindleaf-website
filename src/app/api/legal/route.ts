import { NextResponse } from 'next/server';
import { getLegalContent, saveLegalContent } from '@/lib/db';

export async function GET() {
  try {
    const content = await getLegalContent();
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveLegalContent(body);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
