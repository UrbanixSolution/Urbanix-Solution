'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PhoneCall, Code2, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'

const PROCESS_STEPS = [
  {
    step: '01',
    icon: PhoneCall,
    title: 'Strategy Call',
    headline: 'We understand your local business goals.',
    description:
      'We begin with a focused 1-on-1 discovery call to map out your market, analyze local competitors, and define exact growth metrics for your website or app.',
    highlights: ['Goal Alignment', 'Competitor Audit', 'Custom Growth Plan'],
    accent: 'from-[#00c4cc]/20 to-transparent',
    badgeColor: 'text-[#00c4cc] bg-[#00c4cc]/10 border-[#00c4cc]/30',
  },
  {
    step: '02',
    icon: Code2,
    title: 'Design & Development',
    headline: 'We build your custom fast-loading digital asset.',
    description:
      'Our core engineers craft a bespoke, mobile-optimized site with lightning-fast Next.js architecture, high-converting copy, and seamless user experience.',
    highlights: ['Sub-Second Load Time', 'Mobile-First Design', 'SEO Optimization'],
    accent: 'from-[#3d5a99]/20 to-transparent',
    badgeColor: 'text-[#9ab0d8] bg-[#3d5a99]/15 border-[#3d5a99]/30',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Launch & Scale',
    headline: 'We hand over the system and help you drive leads.',
    description:
      'We deploy your live asset, integrate direct WhatsApp & CRM lead channels, and provide hands-on support to ensure continuous traffic and conversion growth.',
    highlights: ['WhatsApp Lead Funnel', 'Instant Live Deploy', 'Ongoing Growth Support'],
    accent: 'from-[#10b981]/20 to-transparent',
    badgeColor: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
  },
]

export default function SimpleProcess() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="our-process"
      className="section-py bg-[#080c14] border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden"
    >
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00c4cc]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3d5a99]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-wrap relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(61,90,153,0.15)] text-[#9ab0d8] border border-[rgba(61,90,153,0.3)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00c4cc] animate-pulse" />
            Clear & Predictable Delivery
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl text-white mb-4">
            Our Simple 3-Step Process
          </h2>
          <p className="text-sm sm:text-base text-[#8892a4] leading-relaxed">
            From initial strategy to live launch — working with us is streamlined, transparent, and built entirely around driving measurable ROI.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {PROCESS_STEPS.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                id={`process-step-${index + 1}`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="card-dark group p-7 sm:p-8 flex flex-col justify-between border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,196,204,0.3)] rounded-2xl relative transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(0,196,204,0.06)]"
              >
                {/* Gradient Top Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${item.accent}`} />

                <div>
                  {/* Top Row: Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${item.badgeColor}`}>
                      STEP {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-white group-hover:scale-110 group-hover:border-[rgba(0,196,204,0.4)] transition-all duration-300">
                      <Icon size={22} className="text-[#9ab0d8] group-hover:text-[#00c4cc] transition-colors" />
                    </div>
                  </div>

                  {/* Step Title & Subheadline */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00c4cc] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#9ab0d8] mb-4 italic">
                    "{item.headline}"
                  </p>

                  {/* Body Description */}
                  <p className="text-xs text-[#8892a4] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                  {item.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-2 text-[11px] text-[#a0aec0]">
                      <CheckCircle2 size={13} className="text-[#00c4cc] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Desktop Connector Arrow */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#0d1120] border border-[rgba(255,255,255,0.1)] items-center justify-center text-[#4a5568]">
                    <ArrowRight size={14} />
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
