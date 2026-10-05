import { createClient } from '@/lib/supabase/server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProjectsArchiveClient from './ProjectsArchiveClient';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Architectural Portfolio & Selected Works | SRJ Studio',
  description:
    'Explore the complete collection of luxury residential villas, bespoke interior ateliers, and full-scope turnkey architectural commissions by Syed Raza Jan.',
};

export const revalidate = 30;

const fallbackProjects = [
  {
    id: '1',
    title: 'Modern Escape Villa',
    slug: 'modern-escape-villa',
    category: 'Architecture',
    discipline: 'Architecture & Landscape',
    location: 'Islamabad · Pakistan',
    scale: '5,400 sq.ft',
    scope: 'Private Luxury Residence',
    image_url: '/images/project-villa.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'Travertine Timber Atelier',
    slug: 'travertine-timber-atelier',
    category: 'Interior',
    discipline: 'Interior Architecture & Styling',
    location: 'Lahore · Pakistan',
    scale: '3,800 sq.ft',
    scope: 'Bespoke Atelier Design',
    image_url: '/images/project-interior.jpg',
    featured: false,
  },
  {
    id: '3',
    title: 'Cantilever Concrete Villa',
    slug: 'cantilever-concrete-villa',
    category: 'Architecture',
    discipline: 'Brutalist Residence & Planning',
    location: 'Islamabad · Pakistan',
    scale: '6,200 sq.ft',
    scope: 'Architectural Commission',
    image_url: '/images/project-facade.jpg',
    featured: true,
  },
  {
    id: '4',
    title: 'Elegant Soft Makeover',
    slug: 'elegant-soft-makeover',
    category: 'Turnkey',
    discipline: 'Turnkey Execution & Supervision',
    location: 'Islamabad · Pakistan',
    scale: '3,200 sq.ft',
    scope: 'Turnkey Commission',
    image_url: '/images/project-1.jpg',
    featured: false,
  },
  {
    id: '5',
    title: 'Horizon Sanctuary House',
    slug: 'horizon-sanctuary-house',
    category: 'Architecture',
    discipline: 'Sustainable & Biophilic Architecture',
    location: 'Murree Hills · Pakistan',
    scale: '4,800 sq.ft',
    scope: 'Hillside Sanctuary',
    image_url: '/images/hero.jpg',
    featured: false,
  },
];

export default async function ProjectsArchivePage() {
  let projects = [];
  let categories = [
    { id: 'all', name: 'all', label: 'All Commissions' },
    { id: 'Architecture', name: 'Architecture', label: 'Architecture & Villas' },
    { id: 'Interior', name: 'Interior', label: 'Interior Architecture' },
    { id: 'Turnkey', name: 'Turnkey', label: 'Turnkey Execution' },
  ];

  try {
    const supabase = createClient();

    // 1. Fetch published projects
    const { data: projData, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!projErr && projData && projData.length > 0) {
      projects = projData;
    } else {
      projects = fallbackProjects;
    }

    // 2. Fetch categories
    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (!catErr && catData && catData.length > 0) {
      categories = [
        { id: 'all', name: 'all', label: 'All Commissions' },
        ...catData,
      ];
    } else {
      // Fallback from data/categories.json
      const catPath = path.join(process.cwd(), 'data', 'categories.json');
      if (fs.existsSync(catPath)) {
        const raw = fs.readFileSync(catPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) {
          categories = [
            { id: 'all', name: 'all', label: 'All Commissions' },
            ...parsed,
          ];
        }
      }
    }
  } catch (err) {
    projects = fallbackProjects;
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <ProjectsArchiveClient initialProjects={projects} initialCategories={categories} />
      <Footer />
    </div>
  );
}
