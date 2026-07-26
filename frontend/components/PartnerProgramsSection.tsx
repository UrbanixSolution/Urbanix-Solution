'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Building2,
  ArrowRight,
  Sparkles,
  Coins,
  Rocket,
  Users,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Zap
} from 'lucide-react'

export default function PartnerProgramsSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-[#0b0f19] text-[#f5f5f7]">
      {/* Background ambient lighting & radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(0, 196, 204, 0.08), transparent 60%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.06), transparent 50%)',
        }}
      />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="section-wrap relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 1. Urgency Banner ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)] hover:border-cyan-400/50 transition-all duration-300 group">
            {/* Subtle animated light bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
            
            <div className="flex items-center justify-center gap-3 text-center sm:text-left">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
              </span>
              <p className="text-sm sm:text-base font-medium text-cyan-300 tracking-wide leading-relaxed">
                🚀 <span className="font-bold text-white">Note:</span> We currently have <span className="text-cyan-400 font-extrabold underline underline-offset-4 decoration-cyan-500/50">3 active client projects</span> pending allocation. Applications are reviewed on a rolling basis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-widest shadow-inner">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Choose Your Partner Path</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-5xl text-white tracking-tight">
            High-Impact Opportunities for <br className="hidden sm:inline" />
            <span className="heading-serif-italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Builders & Agencies
            </span>
          </h2>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Select the track that matches your goals. Get access to vetted client builds, milestone payouts, and exclusive network support.
          </p>
        </div>

        {/* ── 2 & 3. Modern Program Cards Grid ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">

          {/* ── CARD 1: Student Partner Program ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 hover:border-cyan-500/40 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-400 transition-all duration-500" />
            
            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                  <GraduationCap size={28} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-sm">
                  Students & Developers
                </span>
              </div>

              {/* Main Headline */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-tight">
                Stop building dummy projects. Start coding for real clients.
              </h3>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 font-normal">
                Earn pocket money, build a killer portfolio, and get real-world industry experience right from your hostel room.
              </p>

              {/* Feature List */}
              <div className="space-y-5 mb-10 border-t border-slate-800/80 pt-6">

                {/* Point 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      💰 Earn While You Learn
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Get paid per project. No fixed 9-to-5 hours, work whenever you are free.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Rocket size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🚀 Real-World Experience
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Say goodbye to boring college assignments. Build live websites and apps that actual businesses use.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🤝 Exclusive Network
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Work alongside top developers, get code reviews, and level up your skills 10x faster.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/student-partner#apply-form-section"
                id="apply-student-partner-btn"
                className="w-full py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-base font-extrabold flex items-center justify-center gap-2.5 hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
              >
                <span>Apply to Earn & Learn</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>


          {/* ── CARD 2: Freelancers & Micro-Agencies Section ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 hover:border-blue-500/40 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300"
          >
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400 transition-all duration-500" />

            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300">
                  <Building2 size={28} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-500/30 shadow-sm">
                  Freelancers & Micro-Agencies
                </span>
              </div>

              {/* Main Headline */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-blue-300 transition-colors leading-tight">
                Tired of hunting for clients? Let us bring the projects to you.
              </h3>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 font-normal">
                We handle the client meetings, negotiations, and headaches. You just do what you do best: create.
              </p>

              {/* Feature List */}
              <div className="space-y-5 mb-10 border-t border-slate-800/80 pt-6">

                {/* Point 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      📈 Consistent Overflow Work
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Get access to high-ticket, premium client projects delivered straight to your inbox.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🤫 100% White-Label
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      You build the magic behind the scenes. Complete privacy and professional collaboration.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      💸 Zero Client Friction
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      No more chasing clients for payments. We ensure prompt, milestone-based payouts.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/agency-partner#agency-form-container"
                id="join-agency-partner-btn"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-base font-extrabold flex items-center justify-center gap-2.5 hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]"
              >
                <span>Join the Partner Network</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
