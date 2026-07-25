import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, ArrowRight, Building2, Sparkles, Briefcase } from 'lucide-react'
import CareerForm from '@/components/CareerForm'

export const metadata: Metadata = {
  title: 'Careers & Partnerships — Join Urbanix Solution Network',
  description:
    'Join our elite network of student developers, freelancers, and specialized micro-agencies to build high-impact client projects.',
}

export default function CareerPage() {
  return (
    <div className="pt-[68px] bg-[#0b0f19] min-h-screen">
      
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section id="career-hero" className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(61,90,153,0.15), transparent 70%)',
          }}
        />

        <div className="section-wrap relative z-10 text-center max-w-5xl mx-auto">
          <p className="label-caps mb-4 text-[#9ab0d8] inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            Talent & Partner Network
          </p>

          <h1 id="career-heading" className="heading-serif text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Join the <span className="heading-serif-italic text-[#9ab0d8]">Urbanix Solution Network</span>
          </h1>

          <p id="career-subtext" className="text-base sm:text-xl text-[#8892a4] leading-relaxed max-w-3xl mx-auto mb-12">
            Whether you are an ambitious student developer, a skilled freelancer, or a specialized micro-agency, we have live client projects waiting for you.
          </p>

          {/* ── Resized & Enhanced Partner Cards (Student vs Agency) ───── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            
            {/* Card 1: Student Partner Program */}
            <div className="card-dark p-8 sm:p-10 rounded-3xl min-h-[340px] border border-[rgba(0,196,204,0.4)] bg-gradient-to-b from-[rgba(0,196,204,0.12)] via-[#111827] to-[rgba(61,90,153,0.15)] flex flex-col justify-between hover:border-[#00c4cc] hover:shadow-[0_0_40px_rgba(0,196,204,0.2)] transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(0,196,204,0.18)] border border-[rgba(0,196,204,0.4)] text-[#00c4cc] flex items-center justify-center shadow-[0_0_20px_rgba(0,196,204,0.2)]">
                    <GraduationCap size={28} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#00c4cc] bg-[rgba(0,196,204,0.12)] px-3.5 py-1.5 rounded-full border border-[rgba(0,196,204,0.3)]">
                    Students & Freelancers
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-[#00c4cc] transition-colors">
                  Student Partner Program
                </h3>
                <p className="text-sm sm:text-base text-[#8892a4] leading-relaxed mb-8">
                  Earn while you learn from your college hostel room. Work on live client builds, gain real-world project experience, and get paid per project.
                </p>
              </div>

              <Link
                href="/student-partner"
                id="student-partner-btn"
                className="w-full py-4 px-6 rounded-2xl bg-[#00c4cc] hover:bg-[#009da3] text-[#0b0f19] text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(0,196,204,0.35)] hover:scale-[1.02]"
              >
                <span>Student Partner Network</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: B2B Agency Partner Program */}
            <div className="card-dark p-8 sm:p-10 rounded-3xl min-h-[340px] border border-[rgba(96,165,250,0.4)] bg-gradient-to-b from-[rgba(61,90,153,0.25)] via-[#111827] to-[rgba(16,185,129,0.12)] flex flex-col justify-between hover:border-[#60a5fa] hover:shadow-[0_0_40px_rgba(96,165,250,0.2)] transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(96,165,250,0.18)] border border-[rgba(96,165,250,0.4)] text-[#60a5fa] flex items-center justify-center shadow-[0_0_20px_rgba(96,165,250,0.2)]">
                    <Building2 size={28} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#60a5fa] bg-[rgba(96,165,250,0.12)] px-3.5 py-1.5 rounded-full border border-[rgba(96,165,250,0.3)]">
                    Agencies & Brands
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                  Agency Partner Program
                </h3>
                <p className="text-sm sm:text-base text-[#8892a4] leading-relaxed mb-8">
                  Are you a specialized video editing, SEO, or dev agency? Partner with us to take on high-ticket white-label overflow client projects.
                </p>
              </div>

              <Link
                href="/agency-partner"
                id="agency-partner-btn"
                className="w-full py-4 px-6 rounded-2xl bg-[#3d5a99] hover:bg-[#4b6cb7] text-white text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(61,90,153,0.4)] hover:scale-[1.02]"
              >
                <span>Agency Collaboration</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── Roles & Application Form Component ──────────────────── */}
      <CareerForm />

    </div>
  )
}
