import type { Metadata } from 'next'
import {
  GraduationCap, ArrowRight,
  Coins, Rocket, Users
} from 'lucide-react'
import CareerForm from '@/components/CareerForm'

export const metadata: Metadata = {
  title: 'Student Partner Program — Earn While You Learn | Urbanix Solution',
  description:
    'Stop building dummy projects. Start coding for real clients. Earn pocket money, build a killer portfolio, and get real-world industry experience right from your hostel room.',
}

const STUDENT_BENEFITS = [
  {
    icon: Coins,
    color: 'emerald',
    title: '💰 Earn While You Learn',
    description: 'Get paid per project. No fixed 9-to-5 hours, work whenever you are free.',
  },
  {
    icon: Rocket,
    color: 'cyan',
    title: '🚀 Real-World Experience',
    description: 'Say goodbye to boring college assignments. Build live websites and apps that actual businesses use.',
  },
  {
    icon: Users,
    color: 'purple',
    title: '🤝 Exclusive Network',
    description: 'Work alongside top developers, get code reviews, and level up your skills 10x faster.',
  },
]

const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Fill Out Application',
    description: 'Submit your tech/design skills, portfolio links, and your state/district location below.',
  },
  {
    step: '02',
    title: 'Get Verified',
    description: 'Our core team reviews your work samples and adds you to our verified student talent pool.',
  },
  {
    step: '03',
    title: 'Claim & Earn',
    description: 'Receive local client project assignments matching your stack and earn direct project payouts.',
  },
]

export default function StudentPartnerPage() {
  return (
    <div className="pt-[68px] bg-[#0b0f19] min-h-screen text-[#f5f5f7]">
      
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden border-b border-slate-800/60">
        {/* Glow Effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,196,204,0.14), transparent 70%)',
          }}
        />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#3d5a99]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="section-wrap relative z-10 text-center max-w-4xl mx-auto">
          
          {/* Program Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,196,204,0.12)] border border-[rgba(0,196,204,0.3)] text-[#00c4cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,196,204,0.2)]">
            <GraduationCap size={16} />
            <span>Student Partner Program</span>
          </div>

          {/* Main Headline */}
          <h1 className="heading-serif text-4xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Stop building dummy projects. <br />
            <span className="heading-serif-italic text-[#00c4cc]">Start coding for real clients.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
            Earn pocket money, build a killer portfolio, and get real-world industry experience right from your hostel room.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#apply-form-section"
              id="hero-apply-earn-learn-btn"
              className="py-4 px-8 rounded-2xl bg-[#00c4cc] hover:bg-[#00a8af] text-[#0b0f19] text-base font-extrabold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,196,204,0.35)]"
            >
              <span>Apply to Earn & Learn</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="#how-it-works"
              className="btn-ghost py-3.5 px-6 text-sm font-semibold text-slate-400 hover:text-white"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Core Student Benefits Section ──────────────────────── */}
      <section className="section-py border-b border-slate-800/60 bg-slate-950/40">
        <div className="section-wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="label-caps mb-3 text-[#00c4cc]">Why Join Us?</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-white">
              Built For Ambitious <span className="heading-serif-italic">College Developers</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to gain real industry exposure without compromising your grades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STUDENT_BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative rounded-3xl border border-gray-800 bg-slate-900/60 p-8 hover:border-cyan-500/40 shadow-xl hover:shadow-[0_0_30px_rgba(0,196,204,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[#00c4cc] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00c4cc] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Timeline ────────────────────────────────── */}
      <section id="how-it-works" className="section-py border-b border-slate-800/60 bg-[#0d1424]">
        <div className="section-wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="label-caps mb-3 text-[#00c4cc]">Simple Process</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-white">
              How It <span className="heading-serif-italic">Works</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Three simple steps to start receiving live client projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {TIMELINE_STEPS.map(({ step, title, description }) => (
              <div
                key={step}
                className="relative bg-[#0b0f19] p-8 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
              >
                <div className="text-3xl font-extrabold text-[#00c4cc] font-serif mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form Section ────────────────────────────── */}
      <section className="section-py bg-[#0b0f19]">
        <CareerForm />
      </section>

    </div>
  )
}
