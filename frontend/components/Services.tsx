'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, ShoppingCart, Video, TrendingUp, Share2 } from 'lucide-react'

const services = [
  {
    id:          'svc-web-dev',
    icon:        Globe,
    title:       'Web Development',
    description: 'High-performance, responsive websites built with modern frameworks tailored to establish your online presence.',
  },
  {
    id:          'svc-ecom',
    icon:        ShoppingCart,
    title:       'E-Commerce',
    description: 'Custom storefronts with Stripe integration, inventory management, and order workflows built for revenue growth.',
  },
  {
    id:          'svc-content',
    icon:        Video,
    title:       'Content Creation & Reels',
    description: 'Engaging, high-retention video editing and Instagram Reels that capture attention and build your local audience.',
  },
  {
    id:          'svc-performance-ads',
    icon:        TrendingUp,
    title:       'Performance Marketing (Ads)',
    description: 'Data-driven Meta and Google Ad campaigns designed to generate footfall, leads, and direct sales for your business.',
  },
  {
    id:          'svc-social-media',
    icon:        Share2,
    title:       'Social Media Management',
    description: 'End-to-end brand management. We handle your posting, graphic design, and online reputation.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardAnim = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Services() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="services"
      className="section-py bg-[#0b0f19] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="section-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">

          {/* ── Left: Section label + heading ─────────────────── */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-start"
          >
            <p className="label-caps mb-4">Our Services</p>
            <h2 className="heading-serif text-3xl sm:text-4xl lg:text-[2.6rem]">
              360° Digital
              <br />
              Growth
              <br />
              <span className="heading-serif-italic">Solutions</span>
            </h2>
          </motion.div>

          {/* ── Right: 5-card grid ──────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
          >
            {services.map(({ id, icon: Icon, title, description }) => (
              <motion.div
                key={id}
                variants={cardAnim}
                id={id}
                className="card-dark group p-6 flex flex-col gap-5"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center
                             bg-[rgba(61,90,153,0.12)] border border-[rgba(61,90,153,0.2)]
                             group-hover:bg-[rgba(61,90,153,0.2)] transition-colors duration-200"
                >
                  <Icon
                    size={18}
                    className="text-[#9ab0d8] group-hover:text-white transition-colors duration-200"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13px] text-[#8892a4] leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
