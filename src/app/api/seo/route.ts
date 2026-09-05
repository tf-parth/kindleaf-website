import { NextResponse } from 'next/server';
import { getSeoSettings, saveSeoSettings } from '@/lib/db';

export async function GET() {
  try {
    const seo = await getSeoSettings();
    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveSeoSettings(body);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
