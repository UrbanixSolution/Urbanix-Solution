'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function TrustCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'
  const waMessage = encodeURIComponent(
    'Hi! I would like to get a FREE Digital Growth Audit for my business.'
  )
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`

  return (
    <section
      id="trust-cta"
      className="section-py bg-gradient-to-b from-[#0b0f19] via-[#0d1424] to-[#080c14] border-t border-[rgba(255,255,255,0.06)] relative overflow-hidden"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00c4cc]/10 to-[#3d5a99]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-wrap relative z-10">
        <div className="max-w-4xl mx-auto card-dark p-8 sm:p-14 rounded-3xl border border-[rgba(0,196,204,0.2)] bg-gradient-to-b from-[rgba(15,23,42,0.8)] to-[rgba(11,15,25,0.9)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">

          {/* Subtle Top Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00c4cc] to-transparent opacity-75" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[rgba(0,196,204,0.12)] text-[#00c4cc] border border-[rgba(0,196,204,0.3)] shadow-[0_0_15px_rgba(0,196,204,0.15)]">
              <Zap size={14} className="text-[#00c4cc] animate-pulse" />
              Limited Monthly Audit Slots Available
            </div>

            {/* Main Trust Headline */}
            <h2 className="heading-serif text-3xl sm:text-5xl text-white max-w-2xl mx-auto leading-tight">
              Get a FREE Digital Growth Audit for Your Business
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#8892a4] max-w-xl mx-auto leading-relaxed">
              We'll analyze your current site performance, local SEO rankings, and conversion bottlenecks — completely free with actionable recommendations.
            </p>

            {/* Trust Bullet Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 pb-4 text-xs sm:text-sm text-[#9ab0d8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#00c4cc]" />
                <span>100% Free & Zero Obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#10b981]" />
                <span>Delivered within 24 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#60a5fa]" />
                <span>Reviewed by Senior Engineers</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-sm font-bold shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] inline-flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
              >
                <MessageCircle size={19} className="fill-white/20" />
                <span>Get Your Free Audit on WhatsApp</span>
              </a>

              <Link
                href="/contact"
                id="cta-[#contact-form-btn]"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-white text-sm font-semibold border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] inline-flex items-center justify-center gap-2 transition-all duration-200"
              >
                Or Fill Out Web Form
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Direct Contact Note */}
            <p className="text-[11px] text-[#4a5568]">
              Prefer to talk on phone? Call us directly at{' '}
              <a href={`tel:+${whatsappNumber}`} className="text-[#9ab0d8] hover:underline">
                +{whatsappNumber}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
