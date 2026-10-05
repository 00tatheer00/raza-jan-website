import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    // 1. Authenticate user via Supabase session
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload files.' },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to arrayBuffer and then Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'srj_portfolio_projects',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }, // Automatic compression and WebP/AVIF delivery
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}

function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const uploadSplit = url.split('/upload/');
    if (uploadSplit.length < 2) return null;
    const postUpload = uploadSplit[1];
    const segments = postUpload.split('/');
    const cleanSegments = segments.filter((seg) => {
      if (/^v\d+$/.test(seg)) return false;
      if (seg.includes(',') || /^[cwhqf]_[a-zA-Z0-9]+/.test(seg)) return false;
      return true;
    });
    const joined = cleanSegments.join('/');
    return joined.replace(/\.[^/.]+$/, '');
  } catch (e) {
    return null;
  }
}

export async function DELETE(request) {
  try {
    // 1. Authenticate user via Supabase session
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete files.' },
        { status: 401 }
      );
    }

    // 2. Parse payload
    const body = await request.json().catch(() => ({}));
    const { public_id, public_ids = [], urls = [] } = body;

    const idsToDelete = new Set(public_ids);
    if (public_id) idsToDelete.add(public_id);

    // Extract public_id from provided URLs (cover, gallery, etc.)
    for (const url of urls) {
      const extracted = extractCloudinaryPublicId(url);
      if (extracted) idsToDelete.add(extracted);
    }

    if (idsToDelete.size === 0) {
      return NextResponse.json({
        success: true,
        message: 'No Cloudinary images to delete (e.g. local assets or already removed)',
      });
    }

    // 3. Delete from Cloudinary
    const results = await Promise.allSettled(
      Array.from(idsToDelete).map((pid) => cloudinary.uploader.destroy(pid))
    );

    return NextResponse.json({
      success: true,
      deletedCount: idsToDelete.size,
      results,
    });
  } catch (err) {
    console.error('Cloudinary DELETE error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete images from Cloudinary' },
      { status: 500 }
    );
  }
}

