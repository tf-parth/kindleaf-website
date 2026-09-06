import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getJournalArticles, saveJournalArticle, deleteJournalArticle } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('all') === 'true';
    const articles = await getJournalArticles(includeDrafts);
    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }
    const saved = await saveJournalArticle(body);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/journal', 'page');
      revalidatePath('/journal/[slug]', 'page');
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
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    await deleteJournalArticle(id);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/journal', 'page');
      revalidatePath('/journal/[slug]', 'page');
    } catch (e) {}
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

