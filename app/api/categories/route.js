import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const categoriesFilePath = path.join(process.cwd(), 'data', 'categories.json');

function getLocalCategories() {
  try {
    if (fs.existsSync(categoriesFilePath)) {
      const data = fs.readFileSync(categoriesFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local categories:', e);
  }
  return [
    { id: 'Architecture', name: 'Architecture', label: 'Architecture & Villas', display_order: 1 },
    { id: 'Interior', name: 'Interior', label: 'Interior Architecture', display_order: 2 },
    { id: 'Turnkey', name: 'Turnkey', label: 'Turnkey Execution', display_order: 3 },
  ];
}

function saveLocalCategories(list) {
  try {
    fs.writeFileSync(categoriesFilePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local categories:', e);
  }
}

export async function GET() {
  try {
    // 1. Try Supabase categories table
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ categories: data });
    }
  } catch (e) {
    // Fall back to local file
  }

  const localList = getLocalCategories();
  return NextResponse.json({ categories: localList });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, label } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanLabel = label?.trim() || cleanName;

    // 1. Try to save in Supabase
    try {
      const adminClient = createAdminClient();
      await adminClient.from('categories').insert([
        {
          name: cleanName,
          label: cleanLabel,
          display_order: 99,
        },
      ]);
    } catch (e) {
      console.warn('Could not insert into Supabase categories table, fallback to file:', e.message);
    }

    // 2. Also persist in local json for reliable instant access
    const local = getLocalCategories();
    const exists = local.some((c) => c.name.toLowerCase() === cleanName.toLowerCase());

    if (!exists) {
      const newCategory = {
        id: cleanName.toLowerCase().replace(/\s+/g, '-'),
        name: cleanName,
        label: cleanLabel,
        display_order: local.length + 1,
      };
      local.push(newCategory);
      saveLocalCategories(local);
    }

    return NextResponse.json({ success: true, categories: local });
  } catch (err) {
    console.error('Categories POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    let nameToDelete = '';
    let idToDelete = '';

    const { searchParams } = new URL(request.url);
    nameToDelete = searchParams.get('name') || '';
    idToDelete = searchParams.get('id') || '';

    if (!nameToDelete && !idToDelete) {
      try {
        const body = await request.json();
        nameToDelete = body.name || '';
        idToDelete = body.id || '';
      } catch (e) {
        // no body
      }
    }

    if (!nameToDelete && !idToDelete) {
      return NextResponse.json({ error: 'Category name or id is required' }, { status: 400 });
    }

    const cleanName = nameToDelete.trim();
    const cleanId = idToDelete.trim();

    // 1. Delete from Supabase categories table if present
    try {
      const adminClient = createAdminClient();
      let query = adminClient.from('categories').delete();
      if (cleanId && cleanName) {
        query = query.or(`id.eq.${cleanId},name.ilike.${cleanName}`);
      } else if (cleanId) {
        query = query.eq('id', cleanId);
      } else {
        query = query.ilike('name', cleanName);
      }
      await query;
    } catch (e) {
      console.warn('Could not delete from Supabase categories table:', e.message);
    }

    // 2. Delete from local categories.json
    const local = getLocalCategories();
    const updated = local.filter((c) => {
      if (cleanId && (c.id === cleanId || String(c.id).toLowerCase() === cleanId.toLowerCase())) {
        return false;
      }
      if (cleanName && c.name.toLowerCase() === cleanName.toLowerCase()) {
        return false;
      }
      return true;
    });

    saveLocalCategories(updated);

    return NextResponse.json({ success: true, categories: updated });
  } catch (err) {
    console.error('Categories DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
