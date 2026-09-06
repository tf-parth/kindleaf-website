import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getFaqs, saveFaq, deleteFaq } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('all') === 'true';
    const faqs = await getFaqs(includeDrafts);
    return NextResponse.json(faqs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }
    const saved = await saveFaq(body);
    try {
      revalidatePath('/', 'page');
    } catch (e) {}
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }
    await deleteFaq(id);
    try {
      revalidatePath('/', 'page');
    } catch (e) {}
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

