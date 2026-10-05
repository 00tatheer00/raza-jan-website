import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const initialProjects = [
  {
    title: 'Modern Escape Villa',
    slug: 'modern-escape-villa',
    category: 'Architecture',
    discipline: 'Architecture & Landscape',
    location: 'Islamabad · Pakistan',
    scale: '5,400 sq.ft',
    scope: 'Private Luxury Residence',
    description:
      'Conceived as a dialogue between massive travertine stonework, floating concrete planes, and curated biophilic courtyards. The Modern Escape Villa anchors into the Islamabad foothills with deliberate spatial progression from public reception courts to intimate cantilevered terraces.',
    image_url: '/images/project-villa.jpg',
    gallery_urls: ['/images/project-facade.jpg', '/images/project-interior.jpg', '/images/hero.jpg'],
    featured: true,
    is_published: true,
    display_order: 5,
  },
  {
    title: 'Travertine Timber Atelier',
    slug: 'travertine-timber-atelier',
    category: 'Interior',
    discipline: 'Interior Architecture & Styling',
    location: 'Lahore · Pakistan',
    scale: '3,800 sq.ft',
    scope: 'Bespoke Atelier Design',
    description:
      'A refined synthesis of bespoke millwork, Italian travertine floors, and ambient architectural lighting. Designed for tactile contemplation, this private creative atelier demonstrates our philosophy of material purity and artisanal craftsmanship.',
    image_url: '/images/project-interior.jpg',
    gallery_urls: ['/images/project-1.jpg', '/images/project-villa.jpg'],
    featured: false,
    is_published: true,
    display_order: 4,
  },
  {
    title: 'Cantilever Concrete Villa',
    slug: 'cantilever-concrete-villa',
    category: 'Architecture',
    discipline: 'Brutalist Residence & Planning',
    location: 'Islamabad · Pakistan',
    scale: '6,200 sq.ft',
    scope: 'Architectural Commission',
    description:
      'Bold board-formed concrete volumes hover above landscaped reflection pools. Deep eaves shield expansive double-glazed curtain walls, providing passive solar regulation and cinematic sightlines toward the Margalla Ridge.',
    image_url: '/images/project-facade.jpg',
    gallery_urls: ['/images/project-villa.jpg', '/images/hero.jpg'],
    featured: true,
    is_published: true,
    display_order: 3,
  },
  {
    title: 'Elegant Soft Makeover',
    slug: 'elegant-soft-makeover',
    category: 'Turnkey',
    discipline: 'Turnkey Execution & Supervision',
    location: 'Islamabad · Pakistan',
    scale: '3,200 sq.ft',
    scope: 'Turnkey Commission',
    description:
      'Full turnkey oversight from initial structural refactoring to bespoke furniture fabrication and finish detailing. Delivered with strict adherence to architectural tolerances and timeline precision.',
    image_url: '/images/project-1.jpg',
    gallery_urls: ['/images/project-interior.jpg', '/images/hero.jpg'],
    featured: false,
    is_published: true,
    display_order: 2,
  },
  {
    title: 'Horizon Sanctuary House',
    slug: 'horizon-sanctuary-house',
    category: 'Architecture',
    discipline: 'Sustainable & Biophilic Architecture',
    location: 'Murree Hills · Pakistan',
    scale: '4,800 sq.ft',
    scope: 'Hillside Sanctuary',
    description:
      'Perched along a mountain ridge, this sanctuary house marries locally quarried stone with cedar timber louvers. Living spaces step down along the natural topography, minimizing site disruption.',
    image_url: '/images/hero.jpg',
    gallery_urls: ['/images/project-villa.jpg', '/images/project-facade.jpg'],
    featured: false,
    is_published: true,
    display_order: 1,
  },
];

async function seed() {
  console.log('Checking existing projects in Supabase...');
  const { data: existing, error: checkError } = await supabase.from('projects').select('id, slug');

  if (checkError) {
    console.error('Error querying projects:', checkError.message);
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log(`Projects already exist (${existing.length} records). Skipping seed.`);
    return;
  }

  console.log('Seeding initial 5 projects into Supabase...');
  const { data, error } = await supabase.from('projects').insert(initialProjects).select();

  if (error) {
    console.error('Error seeding projects:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} projects into Supabase!`);
}

seed();
