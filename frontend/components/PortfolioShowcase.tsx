'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProjects, resolveImageUrl, type ApiProject } from '@/lib/api'

const FALLBACK_RECENT: ApiProject[] = [
  {
    id: 101,
    title: 'Pristinix Premium Car Care',
    short_description: 'Transformed Hyderabad doorstep car care with an automated WhatsApp booking engine. Delivered +340% lead conversion growth and 99/100 PageSpeed scores.',
    results_highlight: 'Result: Automated WhatsApp Lead Funnel',
    sector: 'local-business',
    tech_tags: ['WhatsApp Lead Funnel', 'Next.js', 'Local SEO', 'Google Maps API'],
    live_link: 'https://pristinix.vercel.app',
    is_featured: true,
  },
  {
    id: 102,
    title: 'CECP Nexus Platform',
    short_description: 'Multi-team project tracking and workspace system built for an educational technical club.',
    results_highlight: 'Result: Real-time Multi-Team Workspace',
    sector: 'education',
    tech_tags: ['Next.js', 'TypeScript', 'Django REST', 'WebSockets', 'Tailwind CSS'],
    live_link: 'https://cecp-nexus.edu',
    is_featured: true,
  },
  {
    id: 103,
    title: 'Creative Developer Portfolio',
    short_description: 'High-performance interactive portfolio built for a software developer showcasing key projects and skills.',
    results_highlight: 'Result: 3x Client Inquiries',
    sector: 'portfolios',
    tech_tags: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    live_link: 'https://portfolio-demo.app',
    is_featured: true,
  },
]

const GRADIENT_BG: Record<number, string> = {
  0: 'from-[#0f192e] via-[#111827] to-[#0b0f19]',
  1: 'from-[#1b1429] via-[#111827] to-[#0b0f19]',
  2: 'from-[#0b241b] via-[#111827] to-[#0b0f19]',
  3: 'from-[#241a0b] via-[#111827] to-[#0b0f19]',
}

export default function PortfolioShowcase() {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const data = await fetchProjects()
        if (isMounted) {
          if (data && data.length > 0) {
            setProjects(data)
          } else {
            setProjects(FALLBACK_RECENT)
          }
        }
      } catch (err) {
        if (isMounted) setProjects(FALLBACK_RECENT)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="portfolio"
      className="section-py bg-[#0b0f19] border-t border-[rgba(255,255,255,0.05)] overflow-hidden"
    >
      <div className="section-wrap">

        {/* Section Header with Carousel Navigation Controls */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="label-caps mb-3">Portfolio</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-white">
              Our Portfolio
            </h2>
            <p className="text-sm text-[#8892a4] mt-2">
              Digital transformations we've delivered for growing businesses.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll Left"
              className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(61,90,153,0.25)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(61,90,153,0.4)] text-white flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll Right"
              className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(61,90,153,0.25)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(61,90,153,0.4)] text-white flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="/work/local-business"
              id="showcase-see-all"
              className="btn-ghost text-xs font-medium text-[#8892a4] hover:text-white ml-2"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* ── Carousel Slider Container ──────────────────────────────────── */}
        {isLoading ? (
          /* Loading State */
          <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[320px] sm:w-[420px] shrink-0 card-dark p-6 border border-[rgba(255,255,255,0.06)] rounded-2xl animate-pulse space-y-4"
              >
                <div className="w-full h-44 rounded-xl bg-[rgba(255,255,255,0.05)]" />
                <div className="w-24 h-4 rounded bg-[rgba(255,255,255,0.08)]" />
                <div className="w-3/4 h-6 rounded bg-[rgba(255,255,255,0.08)]" />
                <div className="w-full h-10 rounded bg-[rgba(255,255,255,0.04)]" />
              </div>
            ))}
          </div>
        ) : (
          /* Dynamic Portfolio Carousel */
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {projects.map((project, idx) => {
              const tags = project.tech_tags || []
              const rawImg = project.image_url_resolved || project.image_url || project.image || null
              const img = resolveImageUrl(rawImg)
              const projectId = project.id || idx
              const hasImageError = Boolean(imageErrors[projectId])
              const hasValidImg = Boolean(img && !hasImageError)

              const sectorLabel = project.sector
                ? project.sector.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : 'Project'

              return (
                <motion.div
                  key={projectId}
                  id={`portfolio-card-${project.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="w-[320px] sm:w-[420px] shrink-0 snap-start card-dark group p-6 flex flex-col justify-between border border-[rgba(255,255,255,0.07)] hover:border-[rgba(155,176,216,0.25)] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div>
                    {/* Card Image / Screen Mockup */}
                    <div className={`relative w-full h-44 rounded-xl bg-gradient-to-br ${GRADIENT_BG[idx % 4]} overflow-hidden mb-5 border border-[rgba(255,255,255,0.06)]`}>
                      {hasValidImg ? (
                        <Image
                          src={img!}
                          alt={project.title}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 640px) 320px, 420px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() => setImageErrors(prev => ({ ...prev, [projectId]: true }))}
                        />
                      ) : (
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                          {/* Browser Chrome Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                              <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                              <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                            </div>
                            <span className="text-[9px] text-[#8892a4] font-mono opacity-60">
                              {project.live_link && project.live_link.startsWith('http')
                                ? new URL(project.live_link).hostname
                                : 'urbanixsolution.online'}
                            </span>
                          </div>

                          {/* Center Branding */}
                          <div className="flex flex-col items-center justify-center my-auto space-y-1">
                            <Sparkles size={20} className="text-[#9ab0d8] opacity-60" />
                            <span className="text-xs font-semibold text-white tracking-wide text-center px-4">
                              {project.title}
                            </span>
                          </div>

                          {/* Category Badge */}
                          <div className="flex justify-start">
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[rgba(61,90,153,0.3)] text-[#9ab0d8] border border-[rgba(61,90,153,0.4)]">
                              {sectorLabel}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sector Tag & Results Highlight */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(61,90,153,0.15)] text-[#9ab0d8] border border-[rgba(61,90,153,0.25)]">
                        {sectorLabel}
                      </span>
                      {project.results_highlight && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[rgba(16,185,129,0.12)] text-[#10b981] border border-[rgba(16,185,129,0.3)] shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                          <Sparkles size={11} className="text-[#10b981]" />
                          {project.results_highlight}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#9ab0d8] transition-colors duration-200">
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#8892a4] leading-relaxed mb-5 line-clamp-3">
                      {project.short_description}
                    </p>
                  </div>

                  <div>
                    {/* Technology Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tags.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] font-medium text-[#8892a4] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Visit Live Website CTA Button */}
                    <a
                      href={project.live_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[rgba(61,90,153,0.2)] hover:bg-[#2a3f6b] text-xs font-semibold text-[#f5f5f7] border border-[rgba(61,90,153,0.4)] transition-all duration-200 group-hover:border-[rgba(155,176,216,0.4)]"
                    >
                      Visit Live Website
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
