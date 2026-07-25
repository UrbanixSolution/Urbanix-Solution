import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink, ArrowLeft, Tag, MessageCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Category = {
  id: number
  name: string
  slug: string
  description: string
  project_count: number
}

type Project = {
  id: number
  slug: string
  title: string
  client_name: string
  category: Category
  tech_list: string[]
  image_url_resolved: string
  live_url: string
  is_featured: boolean
  short_description?: string
}

type SectorConfig = {
  name: string
  subtitle: string
  description: string
  projects: Project[]
}

// ─────────────────────────────────────────────────────────────
// Initial Sector Data & Fallbacks
// ─────────────────────────────────────────────────────────────

const SECTOR_DATA: Record<string, SectorConfig> = {
  'local-business': {
    name: 'Local Business',
    subtitle: 'Service & Retail Websites',
    description:
      'High-converting custom websites and booking systems for local service providers, retail stores, and regional businesses.',
    projects: [
      {
        id: 201,
        slug: 'pristinix-car-care',
        title: 'Pristinix Premium Car Care',
        client_name: 'Pristinix Doorstep Service',
        category: { id: 1, name: 'Local Business', slug: 'local-business', description: '', project_count: 1 },
        tech_list: ['Next.js', 'Tailwind CSS', 'Django REST', 'Google Maps API', 'WhatsApp API'],
        image_url_resolved: '',
        live_url: 'https://pristinix.vercel.app',
        is_featured: true,
        short_description: 'Complete digital presence and booking system for a premium doorstep service.',
      },
    ],
  },
  'education': {
    name: 'Education & Communities',
    subtitle: 'Learning & Workspace Platforms',
    description:
      'Multi-team tracking, LMS solutions, interactive workspace platforms, and community hubs built for institutions and student clubs.',
    projects: [
      {
        id: 202,
        slug: 'cecp-nexus-platform',
        title: 'CECP Nexus Platform',
        client_name: 'CECP Technical Club',
        category: { id: 2, name: 'Education & Communities', slug: 'education', description: '', project_count: 1 },
        tech_list: ['Next.js', 'TypeScript', 'Django REST', 'WebSockets', 'Tailwind CSS'],
        image_url_resolved: '',
        live_url: 'https://cecp-nexus.edu',
        is_featured: true,
        short_description: 'Multi-team project tracking and workspace system built for an educational technical club.',
      },
    ],
  },
  'portfolios': {
    name: 'Personal Portfolios',
    subtitle: 'Resumes & Creator Sites',
    description:
      'Sleek, responsive, high-performance portfolios and creator websites tailored for developers, designers, and executives.',
    projects: [
      {
        id: 203,
        slug: 'creative-developer-portfolio',
        title: 'Creative Developer Portfolio',
        client_name: 'Generic Placeholder',
        category: { id: 3, name: 'Personal Portfolios', slug: 'portfolios', description: '', project_count: 1 },
        tech_list: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
        image_url_resolved: '',
        live_url: '',
        is_featured: true,
        short_description: 'High-performance interactive portfolio built for a software developer showcasing key projects and skills.',
      },
    ],
  },
}

// ─────────────────────────────────────────────────────────────
// Data Fetching Helper
// ─────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getSectorData(slug: string): Promise<{ category: Category; projects: Project[]; subtitle?: string }> {
  const staticSector = SECTOR_DATA[slug]

  try {
    const resProj = await fetch(`${API_BASE}/projects/?sector=${slug}`, {
      next: { revalidate: 30 },
    })

    if (resProj.ok) {
      const data = await resProj.json()
      const rawList = Array.isArray(data) ? data : data.results || []
      if (rawList.length > 0) {
        const mappedProjects: Project[] = rawList.map((item: any) => ({
          id: item.id,
          slug: item.id.toString(),
          title: item.title,
          client_name: item.sector ? item.sector.toUpperCase() : '',
          category: { id: 1, name: staticSector?.name || slug, slug, description: '', project_count: rawList.length },
          tech_list: item.tech_tags || item.tech_list || [],
          image_url_resolved: item.image_url || item.image || '',
          live_url: item.live_link || item.live_url || '',
          is_featured: item.is_featured ?? true,
          short_description: item.short_description || item.description || '',
        }))
        return {
          category: {
            id: 1,
            name: staticSector?.name || slug,
            slug,
            description: staticSector?.description || `Projects in ${slug}`,
            project_count: mappedProjects.length,
          },
          projects: mappedProjects,
          subtitle: staticSector?.subtitle,
        }
      }
    }
  } catch {
    // API offline or error
  }

  if (staticSector) {
    return {
      category: {
        id: 999,
        name: staticSector.name,
        slug,
        description: staticSector.description,
        project_count: staticSector.projects.length,
      },
      projects: staticSector.projects,
      subtitle: staticSector.subtitle,
    }
  }

  // Format generic slug
  const formattedName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    category: {
      id: 999,
      name: formattedName,
      slug,
      description: `Browse custom ${formattedName} solutions and portfolio projects delivered by Urbanix Solution.`,
      project_count: 0,
    },
    projects: [],
  }
}

// ─────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getSectorData(slug)

  return {
    title: `${category.name} Projects — Urbanix Solution`,
    description:
      category.description ||
      `Browse our ${category.name} portfolio projects and case studies built by Urbanix Solution.`,
  }
}

// ─────────────────────────────────────────────────────────────
// Project Card Component
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const targetUrl = project.live_url || (project as any).live_link || '#'
  const hasTargetUrl = Boolean(targetUrl && targetUrl !== '#')

  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden
                 bg-[#111827] border border-[rgba(255,255,255,0.08)]
                 hover:border-[rgba(155,176,216,0.35)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)]
                 transition-all duration-300"
    >
      {/* Featured badge */}
      {project.is_featured && (
        <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full
                        bg-[#3d5a99]/90 border border-[#3d5a99]/60
                        text-[10px] font-semibold text-white tracking-wider backdrop-blur-md">
          Featured Project
        </div>
      )}

      {/* Mockup Banner (Clickable to Live Site) */}
      {hasTargetUrl ? (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit ${project.title} live site`}
          className="relative h-48 bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0f172a] overflow-hidden flex items-center justify-center p-6 group/banner cursor-pointer"
        >
          {project.image_url_resolved ? (
            <Image
              src={project.image_url_resolved}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="object-cover opacity-80 group-hover/banner:opacity-100 group-hover/banner:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.3)]
                            flex items-center justify-center text-[#9ab0d8] group-hover/banner:scale-110 group-hover/banner:bg-[#3d5a99]/25 transition-all duration-300">
              <Tag size={24} />
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#111827] to-transparent" />
        </a>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0f172a] overflow-hidden flex items-center justify-center p-6">
          {project.image_url_resolved ? (
            <Image
              src={project.image_url_resolved}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.3)]
                            flex items-center justify-center text-[#9ab0d8]">
              <Tag size={24} />
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#111827] to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Client Tag */}
        {project.client_name && (
          <p className="text-[11px] text-[#4a5568] font-semibold tracking-wider uppercase mb-1">
            {project.client_name}
          </p>
        )}

        {/* Title (Clickable to Live Site) */}
        {hasTargetUrl ? (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-white mb-2 leading-snug hover:text-[#00c4cc] transition-colors inline-flex items-center gap-1.5 group/title"
          >
            <span>{project.title}</span>
            <ExternalLink size={14} className="opacity-0 group-hover/title:opacity-100 transition-opacity text-[#00c4cc]" />
          </a>
        ) : (
          <h3 className="text-lg font-bold text-white mb-2 leading-snug">
            {project.title}
          </h3>
        )}

        {/* Short Description */}
        {project.short_description && (
          <p className="text-xs text-[#8892a4] leading-relaxed mb-4">
            {project.short_description}
          </p>
        )}

        {/* Tech stack chips */}
        {project.tech_list && project.tech_list.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech_list.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[10px] font-medium
                           text-[#8892a4] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Action Links */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {hasTargetUrl ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`project-live-${project.id}`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#00c4cc]
                         hover:text-white transition-colors"
            >
              <ExternalLink size={13} />
              Visit Live Site
            </a>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium italic">Demo Available</span>
          )}
          <Link
            href={`/contact?project=${encodeURIComponent(project.title)}`}
            id={`project-similar-${project.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-[#4a5568]
                       hover:text-[#8892a4] transition-colors group/link"
          >
            Similar project
            <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// Smart WhatsApp CTA Component
// ─────────────────────────────────────────────────────────────

function SmartWhatsAppCTA({ sectorName }: { sectorName: string }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'
  const messageText = `Hi Urbanix Solution, I am interested in building a ${sectorName} website.`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`

  return (
    <section className="section-py border-t border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#0b0f19] to-[#080c14] relative overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px]
                    bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none"
      />

      <div className="section-wrap relative z-10">
        <div
          className="max-w-3xl mx-auto text-center rounded-2xl p-8 sm:p-12
                      bg-[#111827]/90 border border-[rgba(16,185,129,0.25)]
                      shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-xl"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                        bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)]
                        text-xs font-semibold text-emerald-400 mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Quick Consultation Available
          </div>

          {/* Question Title */}
          <h2 className="heading-serif text-2xl sm:text-4xl text-white mb-4 leading-snug">
            Want a similar website for your business?
          </h2>

          {/* Subtitle / Context */}
          <p className="text-sm sm:text-base text-[#8892a4] leading-relaxed max-w-xl mx-auto mb-8">
            Connect with our lead development team on WhatsApp. Share your ideas, discuss project requirements, and get a tailored estimate for your <span className="text-emerald-400 font-semibold">{sectorName}</span> platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Styled WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-sector-cta"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white
                         bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
                         shadow-[0_4px_20px_rgba(16,185,129,0.35)]
                         hover:shadow-[0_6px_28px_rgba(16,185,129,0.5)]
                         transition-all duration-200 flex items-center justify-center gap-2.5 group"
            >
              {/* WhatsApp Icon */}
              <svg
                className="w-5 h-5 fill-current transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.594-1.048 3.827 3.905-1.025 1.887 1.271z" />
              </svg>
              <span>Discuss Your Project on WhatsApp</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Standard Contact Form Option */}
            <Link
              href={`/contact?interest=${encodeURIComponent(sectorName)}`}
              id="contact-sector-cta"
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold text-[#8892a4] hover:text-white
                         border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]
                         rounded-xl transition-all"
            >
              Or Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Sector Page Component
// ─────────────────────────────────────────────────────────────

export default async function WorkSectorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { category, projects, subtitle } = await getSectorData(slug)

  return (
    <div className="min-h-screen bg-[#0b0f19]">

      {/* ── Page Hero ───────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
                          bg-[radial-gradient(ellipse_at_top,rgba(61,90,153,0.12),transparent_70%)]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />

        <div className="section-wrap relative">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-8 text-xs text-[#4a5568]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#8892a4] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/work/local-business" className="hover:text-[#8892a4] transition-colors">
              Work
            </Link>
            <span>/</span>
            <span className="text-[#8892a4]">{category.name}</span>
          </nav>

          {/* Sector Tag */}
          <p className="label-caps mb-3">
            {subtitle ? subtitle : 'Industry Sector Portfolio'}
          </p>

          {/* Main Title */}
          <h1 className="heading-serif text-[clamp(2.2rem,5vw,3.8rem)] text-white mb-5 max-w-3xl leading-tight">
            {category.name}{' '}
            <span className="heading-serif-italic text-[#9ab0d8]">Projects</span>
          </h1>

          {/* Subtitle / Description & Stats */}
          <div className="flex flex-wrap items-center gap-6">
            {category.description && (
              <p className="text-base sm:text-lg text-[#8892a4] leading-relaxed max-w-2xl">
                {category.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-[#4a5568] bg-[#111827] px-3.5 py-1.5 rounded-full border border-[rgba(255,255,255,0.06)]">
              <span className="w-2 h-2 rounded-full bg-[#3d5a99]" />
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} featured
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects Grid ─────────────────────────────────────── */}
      <section className="section-py pt-4" id="projects">
        <div className="section-wrap">
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-[#111827]/50 rounded-2xl border border-[rgba(255,255,255,0.06)]">
              <Tag size={32} className="mx-auto text-[#3d5a99] mb-4" />
              <p className="text-sm text-[#8892a4] mb-4">
                No active projects listed under <span className="text-white font-semibold">{category.name}</span> yet.
              </p>
              <Link href="/contact" className="text-xs font-semibold text-[#9ab0d8] hover:underline">
                Be our first project in this sector →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Smart WhatsApp CTA ──────────────────────────────────── */}
      <SmartWhatsAppCTA sectorName={category.name} />

      {/* ── Secondary Footer Nav ──────────────────────────────── */}
      <section className="py-8 border-t border-[rgba(255,255,255,0.05)] bg-[#080c14]">
        <div className="section-wrap flex items-center justify-between">
          <Link href="/work/local-business" className="flex items-center gap-2 text-xs text-[#4a5568] hover:text-[#8892a4] transition-colors">
            <ArrowLeft size={13} />
            Explore All Sectors & Work
          </Link>
          <span className="text-xs text-[#4a5568]">Urbanix Solution</span>
        </div>
      </section>

    </div>
  )
}
