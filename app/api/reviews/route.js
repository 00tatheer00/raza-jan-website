import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');

function getLocalReviews() {
  try {
    if (fs.existsSync(reviewsFilePath)) {
      const data = fs.readFileSync(reviewsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local reviews:', e);
  }
  return [];
}

function saveLocalReviews(list) {
  try {
    fs.writeFileSync(reviewsFilePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local reviews:', e);
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ reviews: data });
    }
  } catch (e) {}

  const localList = getLocalReviews();
  return NextResponse.json({ reviews: localList });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, role, quote, rating = 5, is_published = true } = body;

    if (!name?.trim() || !quote?.trim()) {
      return NextResponse.json({ error: 'Client name and review quote are required' }, { status: 400 });
    }

    const newReview = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      role: role?.trim() || 'Private Client',
      quote: quote.trim(),
      rating: Number(rating) || 5,
      is_published: Boolean(is_published),
      display_order: Date.now(),
      created_at: new Date().toISOString(),
    };

    // Try Supabase insert
    try {
      const admin = createAdminClient();
      await admin.from('reviews').insert([newReview]);
    } catch (e) {
      console.warn('Could not insert to Supabase reviews table, saving locally:', e.message);
    }

    // Persist locally
    const local = getLocalReviews();
    local.push(newReview);
    saveLocalReviews(local);

    return NextResponse.json({ success: true, reviews: local });
  } catch (err) {
    console.error('Reviews POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to add review' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, name, role, quote, rating, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Try Supabase update
    try {
      const admin = createAdminClient();
      await admin.from('reviews').update({
        ...(name && { name: name.trim() }),
        ...(role !== undefined && { role: role.trim() }),
        ...(quote && { quote: quote.trim() }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(is_published !== undefined && { is_published: Boolean(is_published) }),
      }).eq('id', id);
    } catch (e) {}

    // Update local
    const local = getLocalReviews();
    const updated = local.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          ...(name && { name: name.trim() }),
          ...(role !== undefined && { role: role.trim() }),
          ...(quote && { quote: quote.trim() }),
          ...(rating !== undefined && { rating: Number(rating) }),
          ...(is_published !== undefined && { is_published: Boolean(is_published) }),
        };
      }
      return r;
    });
    saveLocalReviews(updated);

    return NextResponse.json({ success: true, reviews: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Try Supabase delete
    try {
      const admin = createAdminClient();
      await admin.from('reviews').delete().eq('id', id);
    } catch (e) {}

    // Delete local
    const local = getLocalReviews();
    const filtered = local.filter((r) => r.id !== id);
    saveLocalReviews(filtered);

    return NextResponse.json({ success: true, reviews: filtered });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to delete review' }, { status: 500 });
  }
}
