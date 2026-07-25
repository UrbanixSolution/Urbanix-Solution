'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Globe, ShoppingCart, Video,
  TrendingUp, Share2,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'

const expertise = [
  {
    id: 'exp-webdev',
    icon: Globe,
    gradient: 'from-[rgba(61,90,153,0.15)] to-transparent',
    accentColor: '#9ab0d8',
    title: 'Web Development',
    description:
      'High-performance, responsive websites built with modern frameworks tailored to establish your online presence and scale your brand.',
    tags: ['Next.js', 'React', 'Responsive', 'SEO'],
  },
  {
    id: 'exp-ecom',
    icon: ShoppingCart,
    gradient: 'from-[rgba(239,68,68,0.1)] to-transparent',
    accentColor: '#f87171',
    title: 'E-Commerce',
    description:
      'Custom storefronts with Stripe integration, inventory management, order workflows, and analytics dashboards built for revenue growth.',
    tags: ['Storefronts', 'Stripe', 'Checkout UX', 'Analytics'],
  },
  {
    id: 'exp-content-reels',
    icon: Video,
    gradient: 'from-[rgba(245,158,11,0.1)] to-transparent',
    accentColor: '#f59e0b',
    title: 'Content Creation & Reels',
    description:
      'Engaging, high-retention video editing and Instagram Reels that capture attention and build your local audience.',
    tags: ['Reels', 'Short-form Video', 'Editing', 'Branding'],
  },
  {
    id: 'exp-performance-ads',
    icon: TrendingUp,
    gradient: 'from-[rgba(16,185,129,0.1)] to-transparent',
    accentColor: '#10b981',
    title: 'Performance Marketing (Ads)',
    description:
      'Data-driven Meta and Google Ad campaigns designed to generate footfall, leads, and direct sales for your business.',
    tags: ['Meta Ads', 'Google Ads', 'Lead Gen', 'ROAS'],
  },
  {
    id: 'exp-social-media',
    icon: Share2,
    gradient: 'from-[rgba(99,74,153,0.15)] to-transparent',
    accentColor: '#c4b0d8',
    title: 'Social Media Management',
    description:
      'End-to-end brand management. We handle your posting, graphic design, and online reputation.',
    tags: ['Content Strategy', 'Graphic Design', 'Reputation', 'Growth'],
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const card = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function ServicesGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="services"
      className="section-py bg-[#0b0f19] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="section-wrap">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-5"
        >
          <div>
            <p className="label-caps mb-3">Our Services</p>
            <h2 className="heading-serif text-3xl sm:text-4xl">
              360° Digital{' '}
              <span className="heading-serif-italic">Growth Solutions</span>
            </h2>
          </div>
          <Link
            href="/#services"
            id="expertise-cta"
            className="btn-ghost self-start sm:self-auto shrink-0"
          >
            All services <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* 3-col grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="expertise-grid"
        >
          {expertise.map(({ id, icon: Icon, gradient, accentColor, title, description, tags }) => (
            <motion.div
              key={id}
              id={id}
              variants={card}
              className="expertise-card group"
            >
              {/* Top gradient wash */}
              <div
                className={`absolute inset-0 rounded-[0.875rem] bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`}
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className="expertise-icon mb-5"
                style={{
                  background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`,
                }}
              >
                <Icon
                  size={19}
                  style={{ color: accentColor }}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
              </div>

              {/* Text */}
              <h3
                className="text-[15px] font-semibold mb-2.5 tracking-tight transition-colors duration-200"
                style={{ color: '#f5f5f7' }}
              >
                {title}
              </h3>
              <p className="text-[13px] text-[#8892a4] leading-relaxed mb-5 flex-1">
                {description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="expertise-tag"
                    style={{
                      borderColor: `color-mix(in srgb, ${accentColor} 18%, transparent)`,
                      color: accentColor,
                      background: `color-mix(in srgb, ${accentColor} 7%, transparent)`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom arrow — visible on hover */}
              <div className="expertise-arrow" style={{ color: accentColor }}>
                <ArrowUpRight size={14} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
