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

const correctOrders = [
  { slug: 'modern-escape-villa', order: 1 },
  { slug: 'travertine-timber-atelier', order: 2 },
  { slug: 'cantilever-concrete-villa', order: 3 },
  { slug: 'elegant-soft-makeover', order: 4 },
  { slug: 'horizon-sanctuary-house', order: 5 },
];

async function fixOrder() {
  for (const item of correctOrders) {
    const { error } = await supabase
      .from('projects')
      .update({ display_order: item.order })
      .eq('slug', item.slug);
    if (error) {
      console.error(`Error updating ${item.slug}:`, error.message);
    } else {
      console.log(`Updated ${item.slug} to display_order: ${item.order}`);
    }
  }
  console.log('Order update complete!');
}

fixOrder();
