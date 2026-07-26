'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, CheckCircle2, Zap, MapPin, MessageSquare, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { fetchProjects, resolveImageUrl, type Project } from '@/lib/api'

const DUMMY_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Pristinix Premium Car Care',
    tech_list: ['WhatsApp Funnel', 'Next.js', 'Local SEO', 'Google Maps API'],
    image_url: null,
    category: 'Doorstep Detailing & Web App',
    is_featured: true,
    results_highlight: 'Result: Automated WhatsApp Lead Funnel',
    description:
      'Transformed Hyderabad\'s premier doorstep car care business with an automated WhatsApp lead booking funnel. Replaced manual scheduling with direct customer conversion, achieving a +340% increase in qualified service bookings.',
    live_link: 'https://pristinix.vercel.app',
  },
]

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS)
  const [isLoading, setIsLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    let isMounted = true
    fetchProjects().then((api) => {
      if (isMounted) {
        if (api && api.length > 0) setProjects(api)
        setIsLoading(false)
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false)
    })
    return () => { isMounted = false }
  }, [])

  return (
    <section id="portfolio" className="section-py border-t border-[rgba(255,255,255,0.05)]">
      <div className="section-wrap">

        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <p className="label-caps mb-3">Portfolio</p>
          <h2 className="heading-serif text-3xl sm:text-4xl text-white mb-3">
            Our Portfolio
          </h2>
          <p className="text-sm text-[#8892a4] leading-relaxed">
            Digital transformations we've delivered for growing businesses.
          </p>
        </motion.div>

        {/* Featured Card Grid */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="card-dark p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] rounded-2xl animate-pulse space-y-4">
              <div className="w-48 h-6 bg-[rgba(255,255,255,0.08)] rounded" />
              <div className="w-3/4 h-8 bg-[rgba(255,255,255,0.06)] rounded" />
              <div className="w-full h-16 bg-[rgba(255,255,255,0.04)] rounded" />
            </div>
          ) : (
            projects.map((project) => {
              const rawImg = project.image_url_resolved || project.image_url || project.image || null
              const img = resolveImageUrl(rawImg)
              const projectId = project.id
              const hasImageError = Boolean(imageErrors[projectId])
              const hasValidImg = Boolean(img && !hasImageError)

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  id={`portfolio-card-${project.id}`}
                  className="card-dark group p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] rounded-2xl relative overflow-hidden"
                >
                  {hasValidImg && (
                    <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6 border border-[rgba(255,255,255,0.06)]">
                      <Image
                        src={img!}
                        alt={project.title}
                        fill
                        unoptimized={true}
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageErrors(prev => ({ ...prev, [projectId]: true }))}
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(61,90,153,0.15)] text-[#9ab0d8] border border-[rgba(61,90,153,0.25)]">
                          {project.category}
                        </span>
                        {project.results_highlight && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[rgba(16,185,129,0.12)] text-[#10b981] border border-[rgba(16,185,129,0.3)] shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                            <Sparkles size={13} className="text-[#10b981]" />
                            {project.results_highlight}
                          </span>
                        )}
                      </div>
                      <h3 className="heading-serif text-2xl sm:text-3xl text-white">
                        {project.title}
                      </h3>
                    </div>

                    {project.live_link && project.live_link !== '#' && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-solid py-2.5 px-5 text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
                      >
                        <ExternalLink size={14} />
                        Visit Live Site
                      </a>
                    )}
                  </div>

                  <p className="body-text text-sm text-[#8892a4] leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-2 text-xs text-[#9ab0d8]">
                      <Zap size={14} className="text-[#f59e0b]" />
                      <span>Fast Performance</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9ab0d8]">
                      <MessageSquare size={14} className="text-[#10b981]" />
                      <span>WhatsApp Leads</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9ab0d8]">
                      <MapPin size={14} className="text-[#60a5fa]" />
                      <span>Google Maps</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9ab0d8]">
                      <CheckCircle2 size={14} className="text-[#9ab0d8]" />
                      <span>Local SEO Sync</span>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2">
                    {(project.tech_tags || project.tech_list || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded text-xs font-medium text-[#8892a4] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

      </div>
    </section>
  )
}
