import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

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
    description:
      'Conceived as a dialogue between massive travertine stonework, floating concrete planes, and curated biophilic courtyards. The Modern Escape Villa anchors into the Islamabad foothills with deliberate spatial progression from public reception courts to intimate cantilevered terraces.',
    image_url: '/images/project-villa.jpg',
    gallery_urls: ['/images/project-facade.jpg', '/images/project-interior.jpg', '/images/hero.jpg'],
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
    description:
      'A refined synthesis of bespoke millwork, Italian travertine floors, and ambient architectural lighting. Designed for tactile contemplation, this private creative atelier demonstrates our philosophy of material purity and artisanal craftsmanship.',
    image_url: '/images/project-interior.jpg',
    gallery_urls: ['/images/project-1.jpg', '/images/project-villa.jpg'],
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
    description:
      'Bold board-formed concrete volumes hover above landscaped reflection pools. Deep eaves shield expansive double-glazed curtain walls, providing passive solar regulation and cinematic sightlines toward the Margalla Ridge.',
    image_url: '/images/project-facade.jpg',
    gallery_urls: ['/images/project-villa.jpg', '/images/hero.jpg'],
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
    description:
      'Full turnkey oversight from initial structural refactoring to bespoke furniture fabrication and finish detailing. Delivered with strict adherence to architectural tolerances and timeline precision.',
    image_url: '/images/project-1.jpg',
    gallery_urls: ['/images/project-interior.jpg', '/images/hero.jpg'],
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
    description:
      'Perched along a mountain ridge, this sanctuary house marries locally quarried stone with cedar timber louvers. Living spaces step down along the natural topography, minimizing site disruption.',
    image_url: '/images/hero.jpg',
    gallery_urls: ['/images/project-villa.jpg', '/images/project-facade.jpg'],
    featured: false,
  },
];

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  let project = null;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('projects')
      .select('title, scope, description')
      .eq('slug', slug)
      .single();

    if (data) project = data;
  } catch (e) {}

  if (!project) {
    project = fallbackProjects.find((p) => p.slug === slug);
  }

  if (!project) return { title: 'Project Not Found | SRJ Studio' };

  return {
    title: `${project.title} — Architectural Commission | SRJ Studio`,
    description: project.description?.slice(0, 160) || project.scope,
  };
}

export default async function ProjectDetailPage({ params }) {
  const slug = params?.slug;
  let project = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!error && data) {
      project = data;
    }
  } catch (e) {}

  if (!project) {
    project = fallbackProjects.find((p) => p.slug === slug);
  }

  if (!project) {
    notFound();
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#111111' }}>
      <Navbar />

      <main style={{ paddingTop: 'calc(var(--navbar-height, 4.5rem) + 3.5rem)', paddingBottom: '7rem' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.85rem',
                color: '#666666',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
            <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: '0.85rem' }}>/</span>
            <Link
              href="/projects"
              style={{
                fontSize: '0.85rem',
                color: '#666666',
                textDecoration: 'none',
              }}
            >
              Commissions
            </Link>

            <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: '0.85rem' }}>/</span>
            <span style={{ fontSize: '0.85rem', color: '#9e733b', fontWeight: 600 }}>
              {project.title}
            </span>
          </div>

          {/* Project Title Header */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                background: '#fbf8f4',
                borderRadius: '999px',
                color: '#9e733b',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '1.25rem',
                border: '1px solid rgba(184, 134, 11, 0.25)',
              }}
            >
              <span>{project.category}</span>
              <span>✦</span>
              <span>{project.discipline}</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2.75rem, 6vw, 4.8rem)',
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: '#111111',
                marginBottom: '1rem',
              }}
            >
              {project.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#555555', maxWidth: '680px', lineHeight: 1.6 }}>
              {project.scope}
            </p>
          </div>

          {/* Key Specs Architecture Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '2rem',
              background: '#f9f9fa',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '2rem 2.5rem',
              marginBottom: '3.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '0.35rem' }}>
                Location
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111' }}>{project.location}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '0.35rem' }}>
                Scale / Area
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#9e733b' }}>{project.scale}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '0.35rem' }}>
                Discipline
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111' }}>{project.discipline}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888', marginBottom: '0.35rem' }}>
                Execution
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111' }}>SRJ Studio</div>
            </div>
          </div>

          {/* Primary High-Res Cover Visual */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
              marginBottom: '5rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: '#f0f0f0',
              maxHeight: '75vh',
            }}
          >
            <img
              src={project.image_url}
              alt={`${project.title} — Architectural Commission by Syed Raza Jan`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Architectural Narrative */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              marginBottom: '5.5rem',
              alignItems: 'start',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                  fontSize: '2.2rem',
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                }}
              >
                Design Concept & Spatial Harmony
              </h2>
              <div style={{ width: '60px', height: '3px', background: '#9e733b', marginBottom: '1.5rem' }} />
            </div>

            <div>
              <p
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.85,
                  color: '#333333',
                  whiteSpace: 'pre-line',
                }}
              >
                {project.description ||
                  'Conceived with meticulous architectural rigor, this commission balances proportion, materiality, and light to craft a timeless spatial experience.'}
              </p>
            </div>
          </div>

          {/* Project Gallery if available */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div style={{ marginBottom: '5.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                    fontSize: '2.2rem',
                    color: '#111111',
                    marginBottom: '0.5rem',
                  }}
                >
                  Photographic Studies
                </h3>
                <p style={{ color: '#666666', fontSize: '0.95rem' }}>
                  Atmospheric perspectives, material junctions, and volumetric studies.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '2rem',
                }}
              >
                {project.gallery_urls.map((photoUrl, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      background: '#f8f8f8',
                      aspectRatio: '4 / 3',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt={`${project.title} - View ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Dialogue Action Box (Luxurious Anchor Card) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #141618 0%, #1e2022 100%)',
              border: '1px solid rgba(205, 162, 111, 0.35)',
              borderRadius: '20px',
              padding: 'clamp(2rem, 5vw, 4rem)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div>
              <div
                style={{
                  color: '#cda26f',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                Architectural Commissions
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  color: '#ffffff',
                  fontWeight: 400,
                  marginBottom: '0.5rem',
                }}
              >
                Contemplating a Built Commission?
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '540px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Engage directly with principal architect Syed Raza Jan to explore spatial design,
                master planning, or turnkey supervision.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/projects"
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
              >
                ← All Projects
              </Link>
              <a
                href="/#contact"
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '999px',
                  background: '#cda26f',
                  color: '#0c0d0e',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(205, 162, 111, 0.3)',
                }}
              >
                Initiate Project Dialogue →
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
