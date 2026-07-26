'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Search, Code, ArrowRight, CheckCircle2, Terminal, Cpu, Sparkles } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  {
    id: 'benefit-fast',
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Every site we ship passes Core Web Vitals. Sub-second first contentful paint, optimised assets, and edge-cached delivery via Vercel or Cloudflare.',
  },
  {
    id: 'benefit-seo',
    icon: Search,
    title: 'SEO Optimised',
    description:
      'Semantic HTML, structured data, server-side rendering, and automated sitemap generation — built-in from day one, not bolted on afterward.',
  },
  {
    id: 'benefit-code',
    icon: Code,
    title: 'Custom Code',
    description:
      'Zero themes, zero WordPress bloat. Every line is handcrafted for your brand. You own it outright — full source code, no vendor lock-in, ever.',
  },
]

export default function ValueProposition() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeTab, setActiveTab] = useState<'component' | 'terminal'>('component')

  return (
    <section id="value-proposition" className="relative bg-[#0b0f19] py-20 lg:py-28 overflow-hidden border-t border-gray-800/60">
      {/* Background ambient lighting & radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 40%, rgba(6, 182, 212, 0.08), transparent 50%), radial-gradient(circle at 80% 60%, rgba(59, 130, 246, 0.06), transparent 50%)',
        }}
      />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="section-wrap relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ── Left Column: Technical Visual Component (Mock Code Editor) ──── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Glow halo behind code editor */}
            <div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-teal-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 pointer-events-none"
              aria-hidden="true"
            />

            {/* Main Terminal Container */}
            <div className="relative bg-black/60 border border-gray-800 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden group">
              
              {/* Mac-Style Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800/80 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/50" />
                </div>

                {/* Tab Switches */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-gray-800 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveTab('component')}
                    className={`px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-all ${
                      activeTab === 'component'
                        ? 'bg-gray-800 text-cyan-400 border border-gray-700 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Code size={12} />
                    <span>App.tsx</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-all ${
                      activeTab === 'terminal'
                        ? 'bg-gray-800 text-emerald-400 border border-gray-700 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Terminal size={12} />
                    <span>deploy.log</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                  <Cpu size={12} className="text-cyan-400 animate-pulse" />
                  <span>Next.js 15</span>
                </div>
              </div>

              {/* Code Body */}
              <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[340px] flex flex-col justify-between">
                
                {activeTab === 'component' ? (
                  <div className="space-y-1 text-gray-300">
                    <div className="text-gray-500 mb-2">// Enterprise Next.js 15 High-Performance Architecture</div>
                    <div>
                      <span className="text-purple-400">import</span> <span className="text-cyan-300">{`{ NextPage }`}</span> <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;next&apos;</span>
                    </div>
                    <div>
                      <span className="text-purple-400">import</span> <span className="text-cyan-300">{`{ HighSpeedApp }`}</span> <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@urbanix/core&apos;</span>
                    </div>
                    <div className="py-1"></div>
                    <div>
                      <span className="text-purple-400">export default function</span> <span className="text-yellow-300">EnterpriseBuild</span>() &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-purple-400">return</span> (
                    </div>
                    <div className="pl-8 text-cyan-300">
                      &lt;<span className="text-blue-400">HighSpeedApp</span>
                    </div>
                    <div className="pl-12">
                      <span className="text-cyan-400">lighthouseScore</span>=<span className="text-amber-300">&#123;100&#125;</span>
                    </div>
                    <div className="pl-12">
                      <span className="text-cyan-400">coreWebVitals</span>=<span className="text-emerald-300">&quot;PASSED&quot;</span>
                    </div>
                    <div className="pl-12">
                      <span className="text-cyan-400">edgeCached</span>=<span className="text-purple-300">&#123;true&#125;</span>
                    </div>
                    <div className="pl-8 text-cyan-300">&gt;</div>
                    <div className="pl-12 text-gray-300">
                      &lt;<span className="text-blue-400">ClientExperience</span> <span className="text-cyan-400">speed</span>=<span className="text-emerald-300">&quot;sub-second&quot;</span> /&gt;
                    </div>
                    <div className="pl-8 text-cyan-300">
                      &lt;/<span className="text-blue-400">HighSpeedApp</span>&gt;
                    </div>
                    <div className="pl-4">)</div>
                    <div>&#125;</div>
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-300">
                    <div className="text-gray-500">// Vercel Edge Production Deployment Stream</div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span>▲</span> <span>Vercel CLI v34.2.0 — Production Deployment</span>
                    </div>
                    <div className="text-gray-400">
                      [14:15:02] <span className="text-cyan-400">info</span> Building static pages and routes (18/18)...
                    </div>
                    <div className="text-gray-400">
                      [14:15:03] <span className="text-cyan-400">info</span> Generating Edge Runtime Bundles...
                    </div>
                    <div className="p-3 my-2 rounded-lg bg-gray-900/90 border border-gray-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Core Web Vitals Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Passed
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Lighthouse Performance:</span>
                        <span className="text-cyan-400 font-bold">100 / 100</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">First Contentful Paint (FCP):</span>
                        <span className="text-amber-300 font-bold">0.4s</span>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                      <span>✓ Ready: https://app.urbanixsolution.com</span>
                    </div>
                  </div>
                )}

                {/* Status Bar / Badges at bottom of editor */}
                <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 font-medium">Core Web Vitals: Passed</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-500/30 text-cyan-300 font-semibold">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Lighthouse Score: 100</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* ── Right Column: The Features Content ─────────────────── */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <p className="label-caps mb-3 text-cyan-400 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Why It Matters
              </p>
              
              <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Premium quality,
                </span>
                <br />
                <span className="heading-serif-italic text-cyan-400">
                  every single time.
                </span>
              </h2>

              <p className="text-base text-gray-400 leading-relaxed max-w-xl">
                We bring premium, enterprise-level digital solutions to local businesses and growing startups at accessible investments.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {benefits.map(({ id, icon: Icon, title, description }, i) => (
                <motion.div
                  key={id}
                  id={id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-gray-900/30 border border-gray-800 rounded-lg p-5 transition-all duration-300 hover:border-cyan-500/50 hover:bg-gray-800/50 hover:-translate-y-1 flex items-start gap-4 group"
                >
                  {/* Icon with subtle cyan glow */}
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                    <Icon size={20} />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8"
            >
              <Link
                href="/#services"
                id="value-prop-cta"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group"
              >
                <span>See all our services</span>
                <ArrowRight
                  size={16}
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
