'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { fetchProjects } from '@/lib/api'

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ── Inline Device Mockup ────────────────────────────────────── */
function DeviceMockups() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">

      {/* ─── Laptop frame ─────────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{ transform: 'perspective(900px) rotateY(-8deg) rotateX(2deg)' }}
      >
        {/* Screen housing */}
        <div
          className="relative rounded-t-xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
          style={{ width: 480, height: 300, background: '#080c14' }}
        >
          {/* Generated mockup image */}
          <Image
            src="/hero-mockup.png"
            alt="Website UI mockup on laptop and phone"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover object-center"
            priority
          />

          {/* Subtle screen overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(11,15,25,0.3)] pointer-events-none" />

          {/* Screen glare */}
          <div
            className="absolute top-0 left-0 w-1/2 h-1/3 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Laptop hinge */}
        <div
          className="border-x border-[rgba(255,255,255,0.08)]"
          style={{ width: 480, height: 4, background: '#1a2235' }}
        />

        {/* Keyboard base */}
        <div
          className="rounded-b-xl border border-t-0 border-[rgba(255,255,255,0.08)]"
          style={{
            width: 480,
            height: 28,
            background: 'linear-gradient(180deg, #111827 0%, #0d1525 100%)',
          }}
        >
          {/* Trackpad hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Base stand gradient */}
        <div
          className="mx-auto"
          style={{
            width: 380,
            height: 6,
            background: 'linear-gradient(90deg, transparent, rgba(61,90,153,0.3), transparent)',
            borderRadius: '0 0 4px 4px',
          }}
        />
      </div>

      {/* ─── Phone frame (overlapping right side) ─────────────── */}
      <div
        className="absolute z-20"
        style={{
          right: '2%',
          top: '8%',
          transform: 'perspective(600px) rotateY(-4deg) rotateX(1deg)',
        }}
      >
        {/* Phone body */}
        <div
          className="relative rounded-[22px] overflow-hidden border border-[rgba(255,255,255,0.12)]"
          style={{
            width: 160,
            height: 300,
            background: '#080c14',
            boxShadow: '-8px 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Phone notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-[#0b0f19] z-10" />

          {/* Phone screen — mini website content */}
          <div className="absolute inset-0 bg-[#080e18] pt-8">
            {/* Mini website header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-[#2a3f6b]" />
                <div className="w-8 h-1 rounded bg-[rgba(255,255,255,0.2)]" />
              </div>
              <div className="w-6 h-1 rounded bg-[rgba(61,90,153,0.6)]" />
            </div>

            {/* Mini hero area */}
            <div className="px-3 pt-5 space-y-2">
              <div className="text-[7px] font-medium text-[#9ab0d8] tracking-widest uppercase opacity-70">
                Digital Solutions
              </div>
              <div className="space-y-1">
                <div className="w-28 h-2.5 rounded bg-[rgba(255,255,255,0.15)]" />
                <div className="w-20 h-2.5 rounded bg-[rgba(255,255,255,0.1)]" />
              </div>
              <div className="space-y-1 pt-1">
                <div className="w-24 h-1 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="w-20 h-1 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="w-16 h-1 rounded bg-[rgba(255,255,255,0.06)]" />
              </div>
              <div className="pt-2">
                <div className="w-16 h-5 rounded-full bg-[#2a3f6b] flex items-center justify-center">
                  <div className="w-10 h-1 rounded bg-white/40" />
                </div>
              </div>
            </div>

            {/* Mini services strip */}
            <div className="absolute bottom-8 inset-x-0 px-2">
              <div className="space-y-1.5">
                {['End-to-end digital services', 'tailored to your business.'].map((t, i) => (
                  <div key={i} className="w-full h-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', width: i === 0 ? '100%' : '70%' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Phone screen glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[rgba(255,255,255,0.15)]" />
      </div>

      {/* ─── Ambient glow beneath devices ─────────────────────── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 120,
          background: 'radial-gradient(ellipse, rgba(61,90,153,0.18) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  )
}

/* ── Main Hero Component ─────────────────────────────────────── */
export default function Hero() {
  const [projectCount, setProjectCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const projects = await fetchProjects()
        setProjectCount(projects.length)
      } catch (err) {
        console.error('Failed to fetch project count for hero stats:', err)
        setProjectCount(0)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0b0f19]"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 60% 40%, rgba(61,90,153,0.08), transparent 70%)',
        }}
      />

      {/* Subtle top-right corner accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at top right, rgba(26,34,53,0.8), transparent 60%)',
        }}
      />

      <div className="section-wrap w-full pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center min-h-[calc(100vh-7rem)]">

          {/* ── Left: Text Content ─────────────────────────────── */}
          <div className="flex flex-col justify-center max-w-xl">

            {/* Label */}
            <p
              className="label-caps mb-5"
              id="hero-label"
            >
              Strategy. Design. Development.
            </p>

            {/* Main Headline */}
            <h1
              className="heading-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] mb-4"
              id="hero-headline"
            >
              We Build Digital
              <br />
              Experiences That
              <br />
              <span className="heading-serif-italic">Grow Businesses.</span>
            </h1>

            {/* Subtext */}
            <p
              className="body-text text-[15px] mb-9 max-w-md"
              id="hero-subtext"
            >
              Urbanix Solution is a full-service digital agency empowering local businesses and startups. We provide high-performance websites, viral content creation, and targeted ad campaigns to scale your brand.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href="#portfolio"
                id="hero-cta-primary"
                className="btn-solid"
              >
                Explore Our Work
                <ArrowRight size={14} />
              </a>
              <a
                href="#services"
                id="hero-cta-secondary"
                className="btn-ghost group"
              >
                View Our Services
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full
                             border border-[rgba(255,255,255,0.15)] text-[#8892a4]
                             group-hover:border-white/30 group-hover:text-white
                             transition-all duration-200"
                >
                  <ArrowRight size={11} />
                </span>
              </a>
            </div>

            {/* Stats row */}
            <div
              className="flex items-center gap-8 mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)]"
            >
              <div>
                <div className="text-xl font-semibold text-white font-serif h-7 flex items-center">
                  25+
                </div>
                <div className="text-xs text-[#4a5568] mt-0.5 tracking-wide">Vetted Tech Experts</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white font-serif h-7 flex items-center">98%</div>
                <div className="text-xs text-[#4a5568] mt-0.5 tracking-wide">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white font-serif h-7 flex items-center">100%</div>
                <div className="text-xs text-[#4a5568] mt-0.5 tracking-wide">Custom Solutions</div>
              </div>
            </div>
          </div>

          {/* ── Right: Device Mockups ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[360px] sm:h-[420px] lg:h-[520px] w-full"
            id="hero-device-mockup"
          >
            <DeviceMockups />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
