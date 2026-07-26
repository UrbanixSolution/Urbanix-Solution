'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PhoneCall, Code2, Rocket, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'

const PROCESS_STEPS = [
  {
    step: '01',
    icon: PhoneCall,
    title: 'Strategy Call',
    headline: 'We understand your local business goals.',
    highlights: ['Goal Alignment', 'Competitor Audit', 'Custom Growth Plan'],
  },
  {
    step: '02',
    icon: Code2,
    title: 'Design & Development',
    headline: 'We build your custom fast-loading digital asset.',
    highlights: ['Sub-Second Load Time', 'Mobile-First Design', 'SEO Optimization'],
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Launch & Scale',
    headline: 'We hand over the system and help you drive leads.',
    highlights: ['WhatsApp Lead Funnel', 'Instant Live Deploy', 'Ongoing Growth Support'],
  },
]

export default function SimpleProcess() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="our-process"
      className="py-20 lg:py-28 bg-[#080c14] border-t border-gray-800/60 relative overflow-hidden"
    >
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-wrap relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Clear & Predictable Delivery</span>
          </div>

          <h2 className="heading-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Our Simple <span className="heading-serif-italic text-cyan-400">3-Step Process</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            From initial strategy to live launch — working with us is streamlined, transparent, and built entirely around driving measurable ROI.
          </p>
        </motion.div>

        {/* Steps 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle Dashed Desktop Connecting Flow Line */}
          <div 
            className="hidden md:block absolute top-1/2 left-12 right-12 h-[2px] border-t-2 border-dashed border-cyan-500/20 -translate-y-1/2 pointer-events-none z-0" 
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                id={`process-step-${index + 1}`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl relative overflow-hidden p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group z-10"
              >
                {/* Massive Watermark Faded Step Number Background */}
                <div 
                  className="absolute right-0 bottom-0 text-[120px] font-black text-white/5 leading-none pointer-events-none select-none font-serif tracking-tighter group-hover:text-cyan-500/10 transition-colors duration-500"
                  aria-hidden="true"
                >
                  {item.step}
                </div>

                <div>
                  {/* Top Left Prominent Icon Focus */}
                  <div className="w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 flex items-center justify-center p-3 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                    <Icon size={24} />
                  </div>

                  {/* Header Title */}
                  <h3 className="text-2xl font-bold text-white mt-6 mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Minimized Muted Italic Description */}
                  <p className="text-xs text-gray-400 italic mb-6 leading-relaxed">
                    &quot;{item.headline}&quot;
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-4 border-t border-gray-800/80 space-y-2.5 relative z-10">
                  {item.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Desktop Connecting Arrow Indicator between Cards */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div 
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-gray-900 border border-cyan-500/40 items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    aria-hidden="true"
                  >
                    <ChevronRight size={16} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
