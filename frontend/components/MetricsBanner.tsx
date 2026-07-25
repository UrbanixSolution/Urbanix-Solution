'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Smartphone, Code2, ShieldCheck, Rocket, TrendingUp } from 'lucide-react'

const metrics = [
  {
    id: 'metric-speed',
    icon: Zap,
    value: '< 1.2s',
    label: 'Avg. Load Time',
    sublabel: 'Lighthouse 95+ score',
  },
  {
    id: 'metric-responsive',
    icon: Smartphone,
    value: '100%',
    label: 'Responsive Design',
    sublabel: 'All viewports covered',
  },
  {
    id: 'metric-stack',
    icon: Code2,
    value: 'Modern Stack',
    label: 'Next.js · Django · TS',
    sublabel: 'Production-grade tooling',
  },
  {
    id: 'metric-security',
    icon: ShieldCheck,
    value: 'A+ Grade',
    label: 'Security Headers',
    sublabel: 'HTTPS, CSP, HSTS enforced',
  },
  {
    id: 'metric-delivery',
    icon: Rocket,
    value: '2–4 Wks',
    label: 'Typical Delivery',
    sublabel: 'MVP to production-ready',
  },
  {
    id: 'metric-uptime',
    icon: TrendingUp,
    value: '99.9%',
    label: 'Uptime SLA',
    sublabel: 'Monitored 24 / 7',
  },
]

export default function MetricsBanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="metrics-banner"
      ref={ref}
      className="bg-[#080c14] border-y border-[rgba(255,255,255,0.05)]"
    >
      <div className="section-wrap py-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="label-caps mb-2">Why Urbanix Solution</p>
          <h2 className="heading-serif text-2xl sm:text-3xl">
            Built for performance,{' '}
            <span className="heading-serif-italic">by design.</span>
          </h2>
        </motion.div>

        {/* Metrics flex row */}
        <div className="metrics-grid">
          {metrics.map(({ id, icon: Icon, value, label, sublabel }, i) => (
            <motion.div
              key={id}
              id={id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="metric-card group"
            >
              {/* Icon */}
              <div className="metric-icon-wrap">
                <Icon size={18} className="text-[#9ab0d8] group-hover:text-white transition-colors duration-200" />
              </div>

              {/* Value */}
              <div className="text-[1.4rem] font-bold text-white font-serif leading-none mb-1 mt-3">
                {value}
              </div>

              {/* Label */}
              <div className="text-[13px] font-semibold text-[#c8d4e8] mb-1">
                {label}
              </div>

              {/* Sublabel */}
              <div className="text-[11px] text-[#4a5568] tracking-wide">
                {sublabel}
              </div>

              {/* Bottom accent bar */}
              <div className="metric-accent-bar" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
