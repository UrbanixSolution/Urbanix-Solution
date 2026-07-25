'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Zap, Search, FileCode2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  {
    id:       'benefit-fast',
    icon:     Zap,
    color:    '#f59e0b',
    bg:       'rgba(245,158,11,0.08)',
    border:   'rgba(245,158,11,0.2)',
    title:    'Lightning Fast',
    description:
      'Every site we ship passes Core Web Vitals. Sub-second first contentful paint, optimised assets, and edge-cached delivery via Vercel or Cloudflare.',
  },
  {
    id:       'benefit-seo',
    icon:     Search,
    color:    '#10b981',
    bg:       'rgba(16,185,129,0.08)',
    border:   'rgba(16,185,129,0.2)',
    title:    'SEO Optimised',
    description:
      'Semantic HTML, structured data, server-side rendering, and automated sitemap generation — built-in from day one, not bolted on afterward.',
  },
  {
    id:       'benefit-code',
    icon:     FileCode2,
    color:    '#3d5a99',
    bg:       'rgba(61,90,153,0.08)',
    border:   'rgba(61,90,153,0.25)',
    title:    'Custom Code',
    description:
      'Zero themes, zero WordPress bloat. Every line is handcrafted for your brand. You own it outright — full source code, no vendor lock-in, ever.',
  },
]

export default function ValueProposition() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="value-proposition"
      className="value-prop-section"
    >
      {/* Decorative grid overlay */}
      <div className="value-prop-grid-bg" aria-hidden="true" />

      <div className="section-wrap section-py relative z-10">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >

          {/* ── Left: Illustration ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Glow halo behind image */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(61,90,153,0.18) 0%, transparent 70%)',
                filter: 'blur(24px)',
              }}
              aria-hidden="true"
            />

            {/* Outer card frame */}
            <div className="value-prop-image-frame">
              <Image
                src="/value-prop-mockup.png"
                alt="Premium web app UI mockup showing a modern dashboard interface"
                width={620}
                height={440}
                className="w-full h-auto rounded-xl object-cover"
                priority
              />

              {/* Floating badge — top-right */}
              <div className="value-prop-float-badge top-4 right-4">
                <Zap size={11} className="text-[#f59e0b]" />
                <span className="text-[11px] font-semibold text-white">Lighthouse 98</span>
              </div>

              {/* Floating badge — bottom-left */}
              <div className="value-prop-float-badge bottom-4 left-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-semibold text-white">Production Ready</span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Benefits list ─────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <p className="value-prop-label mb-3">Why it matters</p>
              <h2 className="value-prop-heading mb-4">
                Premium quality,
                <br />
                <span className="value-prop-heading-italic">
                  every single time.
                </span>
              </h2>
              <p className="value-prop-body">
                We bring premium, enterprise-level digital solutions to local businesses and growing startups at accessible investments.
              </p>
            </motion.div>

            {/* Benefit cards */}
            <div className="space-y-4">
              {benefits.map(({ id, icon: Icon, color, bg, border, title, description }, i) => (
                <motion.div
                  key={id}
                  id={id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="benefit-card group"
                >
                  {/* Icon */}
                  <div
                    className="benefit-icon flex-shrink-0"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <Icon size={17} style={{ color }} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="benefit-title">{title}</h3>
                    <p className="benefit-desc">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8"
            >
              <Link
                href="/#services"
                id="value-prop-cta"
                className="inline-flex items-center gap-2 text-[13px] font-semibold
                           text-[#9ab0d8] hover:text-white
                           transition-colors duration-200 group"
              >
                See all our services
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
