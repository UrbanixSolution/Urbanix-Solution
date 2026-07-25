'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageSquare, Cpu, Rocket } from 'lucide-react'

const steps = [
  {
    id:          'step-consult',
    number:      '01',
    icon:        MessageSquare,
    title:       'Consult & Plan',
    description: 'A deep-dive discovery session to understand your goals, audience, and technical requirements. You receive a detailed project roadmap and a fixed-price quote.',
    tags:        ['Discovery Call', 'Scope Definition', 'Architecture'],
  },
  {
    id:          'step-build',
    icon:        Cpu,
    number:      '02',
    title:       'Build & Innovate',
    description: 'Our engineers execute with precision. You receive regular progress updates, staging deployments, and dedicated Slack communication throughout.',
    tags:        ['Agile Sprints', 'Live Previews', 'Code Reviews'],
  },
  {
    id:          'step-launch',
    icon:        Rocket,
    number:      '03',
    title:       'Launch & Manage',
    description: 'We deploy with CI/CD pipelines, monitoring, and SEO optimisation. Monthly retainer clients get priority support, updates, and performance reports.',
    tags:        ['CI/CD Deploy', 'Monitoring', 'Monthly Reports'],
  },
]

export default function HowWeWork() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="how-we-work"
      className="section-py bg-[#0d1120] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="section-wrap">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="label-caps mb-3">Our Process</p>
          <h2 className="heading-serif text-3xl sm:text-4xl max-w-sm">
            How We Work
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ id, number, icon: Icon, title, description, tags }, i) => (
            <motion.div
              key={id}
              id={id}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark p-7 flex flex-col gap-5"
            >
              {/* Step header */}
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center
                             bg-[rgba(61,90,153,0.12)] border border-[rgba(61,90,153,0.18)]"
                >
                  <Icon size={18} className="text-[#9ab0d8]" />
                </div>
                <span className="text-3xl font-bold text-[rgba(255,255,255,0.04)] font-serif select-none">
                  {number}
                </span>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
                <p className="text-[13px] text-[#8892a4] leading-relaxed">{description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium
                               text-[#8892a4] bg-[rgba(255,255,255,0.04)]
                               border border-[rgba(255,255,255,0.06)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
