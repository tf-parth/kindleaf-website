import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getOffers, saveOffer, deleteOffer } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    const offers = await getOffers(includeAll);
    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const saved = await saveOffer(body);
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
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }
    await deleteOffer(id);
    try {
      revalidatePath('/', 'page');
    } catch (e) {}
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

