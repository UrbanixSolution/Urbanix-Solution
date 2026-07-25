import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2, Briefcase, Zap, ShieldCheck, Layers, ArrowLeft
} from 'lucide-react'
import AgencyPartnerForm from '@/components/AgencyPartnerForm'

export const metadata: Metadata = {
  title: 'Agency Collaboration & White-Label Partnerships — Urbanix Solution',
  description:
    'Become a certified Urbanix Solution partner. Specialized micro-agencies and video, dev, or SEO teams can partner with us to handle white-label overflow client builds.',
}

const PARTNER_PERKS = [
  {
    icon: Building2,
    title: 'Overflow Client Allocation',
    description:
      'Gain access to pre-vetted, high-budget client projects when our internal bandwidth is full. Focus 100% on execution.',
    color: '#60a5fa',
  },
  {
    icon: Zap,
    title: 'Guaranteed Payout Cycles',
    description:
      'Structured milestone-based payouts directly upon project milestone sign-off. Zero delay or client chase.',
    color: '#10b981',
  },
  {
    icon: Layers,
    title: 'White-Label Operations',
    description:
      'Deliver under your brand or white-labeled under Urbanix Solution standards with clear requirements and pre-packaged assets.',
    color: '#f59e0b',
  },
  {
    icon: ShieldCheck,
    title: 'Dedicated Account Management',
    description:
      'Our team manages client communication, scope changes, and revisions so your team can build efficiently without friction.',
    color: '#c4b0d8',
  },
]

export default function AgencyPartnerPage() {
  return (
    <div className="pt-[68px] bg-[#080c14] min-h-screen">
      
      {/* ── Top Navigation Link ───────────────────────────────────── */}
      <div className="section-wrap pt-8">
        <Link
          href="/career"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8892a4] hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Careers & Talent Network
        </Link>
      </div>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section id="agency-hero" className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(61,90,153,0.18), transparent 75%)',
          }}
        />

        <div className="section-wrap relative z-10 text-center max-w-4xl mx-auto">
          <p className="label-caps mb-4 text-[#60a5fa] inline-flex items-center gap-2 bg-[rgba(96,165,250,0.1)] px-3 py-1 rounded-full border border-[rgba(96,165,250,0.2)]">
            <Briefcase size={13} />
            B2B White-Label Collaboration
          </p>

          <h1 id="agency-heading" className="heading-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Let&apos;s Grow Together. <br className="hidden sm:inline" />
            <span className="heading-serif-italic text-[#60a5fa]">Become a Certified Agency Partner.</span>
          </h1>

          <p id="agency-subtext" className="text-base sm:text-lg text-[#8892a4] leading-relaxed max-w-3xl mx-auto mb-16">
            We are looking for specialized teams and micro-agencies to handle our overflow client projects. Focus on delivering great work—we will handle the client acquisition, billing, and onboarding.
          </p>

          {/* ── Perks Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left mb-16">
            {PARTNER_PERKS.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="card-dark p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0d1320] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `color-mix(in srgb, ${color} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                    }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-[#8892a4] leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── B2B Agency Form Component ──────────────────────────────── */}
      <section className="pb-24 section-wrap relative z-10">
        <AgencyPartnerForm />
      </section>

    </div>
  )
}
