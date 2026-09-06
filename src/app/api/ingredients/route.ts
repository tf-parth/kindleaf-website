import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getIngredients, saveIngredient, deleteIngredient } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('all') === 'true';
    const ingredients = await getIngredients(includeDrafts);
    return NextResponse.json(ingredients);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.botanical) {
      return NextResponse.json({ error: 'Name and botanical name are required' }, { status: 400 });
    }
    const saved = await saveIngredient(body);
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
      return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 });
    }
    await deleteIngredient(id);
    try {
      revalidatePath('/', 'page');
    } catch (e) {}
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

