import { NextResponse } from 'next/server';
import { getReviews, saveReview, updateReviewStatus, deleteReview } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await saveReview(body);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, field, value } = await request.json();
    if (!id || !field || value === undefined) {
      return NextResponse.json({ error: 'Missing review id, field or value' }, { status: 400 });
    }
    if (field !== 'approved' && field !== 'featured') {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    }
    const updated = await updateReviewStatus(id, field, value);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
