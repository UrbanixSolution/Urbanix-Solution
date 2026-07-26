import type { Metadata } from 'next'
import PartnerProgramsSection from '@/components/PartnerProgramsSection'
import CareerForm from '@/components/CareerForm'

export const metadata: Metadata = {
  title: 'Careers & Partnerships — Join Urbanix Solution Network',
  description:
    'Join our elite network of student developers, freelancers, and specialized micro-agencies to build high-impact client projects.',
}

export default function CareerPage() {
  return (
    <div className="pt-[68px] bg-[#0b0f19] min-h-screen">
      
      {/* ── Hero Section Header ───────────────────────────────────── */}
      <section id="career-hero" className="relative pt-16 pb-6 md:pt-20 md:pb-8 overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,196,204,0.12), transparent 70%)',
          }}
        />

        <div className="section-wrap relative z-10 text-center max-w-5xl mx-auto">
          <p className="label-caps mb-4 text-cyan-400 inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            Talent & Partner Network
          </p>

          <h1 id="career-heading" className="heading-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-4 leading-tight">
            Join the <span className="heading-serif-italic text-cyan-400">Urbanix Solution Network</span>
          </h1>

          <p id="career-subtext" className="text-base sm:text-xl text-[#8892a4] leading-relaxed max-w-3xl mx-auto">
            Whether you are an ambitious student developer, a skilled freelancer, or a specialized micro-agency, we have live client projects waiting for you.
          </p>
        </div>
      </section>

      {/* ── Revamped Partner Programs Section (Urgency Banner + Cards) ── */}
      <PartnerProgramsSection />

      {/* ── Roles & Application Form Component ──────────────────── */}
      <CareerForm />

    </div>
  )
}
