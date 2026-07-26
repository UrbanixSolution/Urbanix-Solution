import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Briefcase, ArrowLeft, ArrowRight,
  TrendingUp, ShieldCheck, CreditCard
} from 'lucide-react'
import AgencyPartnerForm from '@/components/AgencyPartnerForm'

export const metadata: Metadata = {
  title: 'Agency Collaboration & White-Label Partnerships — Urbanix Solution',
  description:
    'Tired of hunting for clients? Let us bring the projects to you. We handle client meetings, negotiations, and headaches. You just do what you do best: create.',
}

const AGENCY_PERKS = [
  {
    icon: TrendingUp,
    title: '📈 Consistent Overflow Work',
    description: 'Get access to high-ticket, premium client projects delivered straight to your inbox.',
  },
  {
    icon: ShieldCheck,
    title: '🤫 100% White-Label',
    description: 'You build the magic behind the scenes. Complete privacy and professional collaboration.',
  },
  {
    icon: CreditCard,
    title: '💸 Zero Client Friction',
    description: 'No more chasing clients for payments. We ensure prompt, milestone-based payouts.',
  },
]

export default function AgencyPartnerPage() {
  return (
    <div className="pt-[68px] bg-[#080c14] min-h-screen text-[#f5f5f7]">
      
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
      <section id="agency-hero" className="relative pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(59,130,246,0.15), transparent 75%)',
          }}
        />

        <div className="section-wrap relative z-10 text-center max-w-4xl mx-auto">

          <p className="label-caps mb-4 text-[#60a5fa] inline-flex items-center gap-2 bg-[rgba(96,165,250,0.1)] px-3.5 py-1.5 rounded-full border border-[rgba(96,165,250,0.2)]">
            <Briefcase size={14} />
            B2B White-Label Collaboration
          </p>

          {/* Main Headline */}
          <h1 id="agency-heading" className="heading-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Tired of hunting for clients? <br className="hidden sm:inline" />
            <span className="heading-serif-italic text-blue-400">Let us bring the projects to you.</span>
          </h1>

          {/* Sub-headline */}
          <p id="agency-subtext" className="text-base sm:text-xl text-[#8892a4] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            We handle the client meetings, negotiations, and headaches. You just do what you do best: create.
          </p>

          <div className="mb-14">
            <a
              href="#agency-form-container"
              className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-base font-extrabold hover:scale-105 transition-all shadow-[0_0_25px_rgba(59,130,246,0.35)]"
            >
              <span>Join the Partner Network</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* ── Perks Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-16">
            {AGENCY_PERKS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-7 hover:border-blue-500/40 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8892a4] leading-relaxed">
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
