'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    id:      'plan-starter',
    name:    'Starter',
    price:   '₹24,999',
    period:  'one-time setup',
    tagline: 'Perfect for MVPs & landing pages',
    popular: false,
    features: [
      'Up to 5-page website or MVP',
      'Responsive mobile-first design',
      'Basic SEO optimisation',
      'Contact form integration',
      'Database setup (SQLite / PostgreSQL)',
      '2 revision rounds',
      '30-day bug-fix warranty',
      'Vercel / Railway deployment',
    ],
    cta: 'Get Started',
  },
  {
    id:      'plan-growth',
    name:    'Growth',
    price:   '₹49,999',
    period:  'setup + ₹7,999/mo',
    tagline: 'For businesses ready to scale',
    popular: true,
    features: [
      'Everything in Starter',
      'Full-stack web application',
      'Django REST API + Next.js frontend',
      'Admin dashboard & CMS',
      'User authentication & roles',
      'Monthly content & feature updates',
      'Performance monitoring',
      'Priority WhatsApp support',
    ],
    cta: 'Most Popular — Start Now',
  },
  {
    id:      'plan-pro',
    name:    'Pro',
    price:   'Custom',
    period:  'end-to-end management',
    tagline: 'For enterprises & funded startups',
    popular: false,
    features: [
      'Everything in Growth',
      'Custom SaaS architecture',
      'Microservices & API integrations',
      'AI/ML feature implementation',
      'Celery + Redis task automation',
      'CI/CD pipelines & DevOps',
      'Dedicated Slack channel',
      'SLA-backed response times',
    ],
    cta: 'Request Proposal',
  },
]

export default function Pricing() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" className="section-py bg-[#0d1120] border-t border-[rgba(255,255,255,0.05)]">
      <div className="section-wrap">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="label-caps mb-3">Transparent Pricing</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h2 className="heading-serif text-3xl sm:text-4xl">
              Choose Your <span className="heading-serif-italic">Growth Plan</span>
            </h2>
            <p className="text-[13px] text-[#4a5568] max-w-xs">
              No hidden fees. Full source code ownership from day one.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {plans.map(({ id, name, price, period, tagline, popular, features, cta }, i) => (
            <motion.div
              key={id}
              id={id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                popular
                  ? 'bg-[#111827] border border-[rgba(61,90,153,0.35)] shadow-[0_0_40px_rgba(61,90,153,0.12)] md:-mt-3 md:pb-10'
                  : 'bg-[#0f1623] border border-[rgba(255,255,255,0.06)]'
              }`}
            >
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1
                               rounded-full text-[11px] font-semibold
                               bg-[#2a3f6b] text-white border border-[rgba(61,90,153,0.4)]
                               whitespace-nowrap shadow-[0_0_20px_rgba(61,90,153,0.3)]">
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="mb-4">
                <span className="label-caps">{name}</span>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="text-[2.2rem] font-bold text-white font-serif">{price}</span>
              </div>
              <p className="text-[11px] text-[#4a5568] mb-2">{period}</p>
              <p className="text-[13px] text-[#8892a4] pb-5 mb-5 border-b border-[rgba(255,255,255,0.06)]">
                {tagline}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#8892a4]">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-[#9ab0d8]" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                id={`${id}-cta`}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                           text-[13px] font-medium transition-all duration-250 ${
                  popular
                    ? 'bg-[#2a3f6b] hover:bg-[#3d5a99] text-white border border-[rgba(61,90,153,0.4)] hover:-translate-y-px'
                    : 'border border-[rgba(255,255,255,0.08)] text-[#8892a4] hover:text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {cta}
                <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-[#2a3040] mt-8"
        >
          All prices in INR · GST applicable where required · Custom enterprise quotes available on request
        </motion.p>
      </div>
    </section>
  )
}
