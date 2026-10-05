import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('projects').insert([
    {
      title: 'Category Test',
      slug: 'category-test-dummy',
      category: 'Landscape',
      discipline: 'Test Discipline',
      location: 'Test Location',
      scale: '1,000 sq.ft',
      scope: 'Test Scope',
      image_url: '/images/hero.jpg',
      is_published: false,
    }
  ]).select();

  console.log('Insert test result:', { data, error });

  if (data && data.length > 0) {
    // Delete it right away
    await supabase.from('projects').delete().eq('slug', 'category-test-dummy');
    console.log('Cleaned up test record.');
  }
}

testInsert();
