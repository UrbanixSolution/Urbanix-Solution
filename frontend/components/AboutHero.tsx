'use client'

import { motion } from 'framer-motion'
import { Target, Zap, Users } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function AboutHero() {
  return (
    <section id="about-hero" className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-[#0b0f19] overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 30%, rgba(61,90,153,0.14), transparent 70%)',
        }}
      />

      <div className="section-wrap relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Section label */}
          <motion.p
            {...fadeUp(0.1)}
            id="about-hero-label"
            className="label-caps mb-4 text-[#9ab0d8] inline-flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            Our Mission & Agency Story
          </motion.p>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.2)}
            id="about-hero-heading"
            className="heading-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight"
          >
            Empowering Local Businesses,
            <br />
            <span className="heading-serif-italic text-[#9ab0d8]">
              Driven by Young Talent.
            </span>
          </motion.h1>

          {/* Our Story Paragraph */}
          <motion.p
            {...fadeUp(0.32)}
            id="about-hero-story"
            className="text-base sm:text-lg text-[#8892a4] leading-relaxed max-w-3xl mx-auto mb-12"
          >
            Urbanix Solution was built with a single motive: to help local businesses and offline startups bridge the digital gap. We noticed that great local brands struggle with online presence, so we stepped in to handle everything from custom websites to viral Instagram Reels and Ad campaigns.
          </motion.p>

          {/* 3 Pillar Cards */}
          <motion.div
            {...fadeUp(0.44)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left max-w-3xl mx-auto pt-8 border-t border-[rgba(255,255,255,0.06)]"
          >
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.25)] flex items-center justify-center mb-3">
                <Target size={18} className="text-[#9ab0d8]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Local Business First</h3>
              <p className="text-xs text-[#8892a4] leading-relaxed">Tailored strategies built specifically to drive footfall, calls, and local customers.</p>
            </div>

            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center mb-3">
                <Zap size={18} className="text-[#f59e0b]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">360° Digital Growth</h3>
              <p className="text-xs text-[#8892a4] leading-relaxed">Websites, viral short-form video editing, and targeted performance ad management.</p>
            </div>

            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)] transition-all">
              <div className="w-9 h-9 rounded-lg bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center mb-3">
                <Users size={18} className="text-[#10b981]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Driven Young Talent</h3>
              <p className="text-xs text-[#8892a4] leading-relaxed">Fresh perspectives, high energy, and obsession with modern digital execution.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
