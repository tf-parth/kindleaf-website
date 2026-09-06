import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProducts, saveProduct, deleteProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('all') === 'true';
    const products = await getProducts(includeDrafts);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveProduct(body);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/blends/[slug]', 'page');
    } catch (e) {
      // ignore revalidation in non-edge/mock contexts
    }
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
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }
    await deleteProduct(id);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/blends/[slug]', 'page');
    } catch (e) {
      // ignore revalidation in non-edge/mock contexts
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

