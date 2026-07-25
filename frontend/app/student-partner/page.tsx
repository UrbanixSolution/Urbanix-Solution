import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Zap, Award, Clock, DollarSign, ArrowRight,
  GraduationCap, Laptop, ShieldCheck, Sparkles
} from 'lucide-react'
import CareerForm from '@/components/CareerForm'

export const metadata: Metadata = {
  title: 'Student Partner Program — Earn While You Learn | Urbanix Solution',
  description:
    'Join our elite network of student developers, designers, and marketers. Build live client projects from your hostel room, earn project-based payouts, and build an unbeatable resume.',
}

const PERKS = [
  {
    icon: DollarSign,
    color: '#10b981',
    title: 'Project-Based Payouts',
    description: 'Get paid directly upon project completion. No waiting for monthly cycles or stipend delays.',
  },
  {
    icon: Laptop,
    color: '#00c4cc',
    title: 'Build Your Portfolio',
    description: 'Work on actual live websites and apps. Add real client URLs to your GitHub, Figma, and resume.',
  },
  {
    icon: Clock,
    color: '#f59e0b',
    title: '100% Flexible Hours',
    description: 'Work around your college classes and exams. Take client projects only when you have free time.',
  },
  {
    icon: Award,
    color: '#a855f7',
    title: 'Experience & Certificates',
    description: 'Top performers receive official Internship Completion Certificates, LORs, and direct job recommendations.',
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
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden border-b border-slate-800/60">
        {/* Glow Effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,196,204,0.12), transparent 70%)',
          }}
        />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#3d5a99]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="section-wrap relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,196,204,0.12)] border border-[rgba(0,196,204,0.3)] text-[#00c4cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,196,204,0.2)]">
            <GraduationCap size={16} />
            <span>Student Partner Program</span>
          </div>

          {/* Headline */}
          <h1 className="heading-serif text-4xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Earn While You Learn.
            <br />
            <span className="heading-serif-italic text-[#00c4cc]">Build Live Projects</span> From Your Hostel Room.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Join our elite network of student developers, designers, and marketers. Work on real-world local business projects, earn pocket money, and build an unbeatable resume.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#apply-form-section"
              id="hero-join-network-btn"
              className="btn-solid py-3.5 px-8 text-sm font-bold tracking-wide shadow-[0_0_25px_rgba(0,196,204,0.3)]"
            >
              <span>Join the Network</span>
              <ArrowRight size={16} />
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

      {/* ── Perks / Benefits Grid ───────────────────────────────── */}
      <section className="section-py border-b border-slate-800/60">
        <div className="section-wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="label-caps mb-3 text-[#00c4cc]">Why Join Us?</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-white">
              Built For Ambitious <span className="heading-serif-italic">College Students</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to gain industry exposure without compromising your academic CGPA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(({ icon: Icon, color, title, description }) => (
              <div
                key={title}
                className="card-dark p-7 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{
                      background: `color-mix(in srgb, ${color} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00c4cc] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
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
            {TIMELINE_STEPS.map(({ step, title, description }, idx) => (
              <div
                key={step}
                className="relative bg-[#0b0f19] p-8 rounded-2xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="text-3xl font-extrabold text-[#00c4cc] font-serif mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
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
