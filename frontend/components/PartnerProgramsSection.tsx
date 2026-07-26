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
  CreditCard
} from 'lucide-react'

export default function PartnerProgramsSection() {
  return (
    <section className="relative py-8 md:py-12 text-[#f5f5f7]">
      <div className="section-wrap relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 1. Urgency Banner (Sleek Alert Box) ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10 max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:border-cyan-400/40 transition-all duration-300 group">
            {/* Subtle animated top light bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
            
            <div className="flex items-center justify-center gap-3 text-center">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <p className="text-xs sm:text-sm font-medium text-cyan-300 tracking-wide leading-relaxed">
                🚀 <span className="font-bold text-white">Note:</span> We currently have <span className="text-cyan-400 font-extrabold underline underline-offset-4 decoration-cyan-500/50">3 active client projects</span> pending allocation. Applications are reviewed on a rolling basis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Section Sub-header (Non-competing, natural flow) ─────── */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Choose Your Partner Path</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            High-Impact Opportunities for <span className="text-cyan-400 italic">Builders & Agencies</span>
          </h2>
        </div>

        {/* ── 2 & 3. Modern Program Cards Grid ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">

          {/* ── CARD 1: Student Partner Program ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-7 sm:p-9 hover:border-cyan-500/40 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-400 transition-all duration-500" />
            
            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                  <GraduationCap size={26} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-sm">
                  Students & Developers
                </span>
              </div>

              {/* Explicit Program Title */}
              <h3 className="text-2xl font-bold text-white mb-2">
                Student Partner Program
              </h3>

              {/* Main Catchy Headline */}
              <h4 className="text-lg sm:text-xl font-extrabold text-cyan-300 mb-3 group-hover:text-cyan-200 transition-colors leading-tight">
                Stop building dummy projects. Start coding for real clients.
              </h4>

              {/* Sub-headline */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Earn pocket money, build a killer portfolio, and get real-world industry experience right from your hostel room.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8 border-t border-slate-800/80 pt-5">

                {/* Point 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Coins size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      💰 Earn While You Learn
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Get paid per project. No fixed 9-to-5 hours, work whenever you are free.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Rocket size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      🚀 Real-World Experience
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Say goodbye to boring college assignments. Build live websites and apps that actual businesses use.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Users size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      🤝 Exclusive Network
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Work alongside top developers, get code reviews, and level up your skills 10x faster.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/student-partner"
                id="apply-student-partner-btn"
                className="w-full py-3.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]"
              >
                <span>Apply to Earn & Learn</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>


          {/* ── CARD 2: Freelancers & Micro-Agencies Section ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-7 sm:p-9 hover:border-blue-500/40 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300"
          >
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400 transition-all duration-500" />

            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300">
                  <Building2 size={26} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-500/30 shadow-sm">
                  Freelancers & Micro-Agencies
                </span>
              </div>

              {/* Explicit Program Title */}
              <h3 className="text-2xl font-bold text-white mb-2">
                Agency Partner Program
              </h3>

              {/* Main Catchy Headline */}
              <h4 className="text-lg sm:text-xl font-extrabold text-blue-300 mb-3 group-hover:text-blue-200 transition-colors leading-tight">
                Tired of hunting for clients? Let us bring the projects to you.
              </h4>

              {/* Sub-headline */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                We handle the client meetings, negotiations, and headaches. You just do what you do best: create.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8 border-t border-slate-800/80 pt-5">

                {/* Point 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      📈 Consistent Overflow Work
                    </h5>
                    <p className="text-xs text-[#8892a4] leading-relaxed mt-0.5">
                      Get access to high-ticket, premium client projects delivered straight to your inbox.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      🤫 100% White-Label
                    </h5>
                    <p className="text-xs text-[#8892a4] leading-relaxed mt-0.5">
                      You build the magic behind the scenes. Complete privacy and professional collaboration.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                      💸 Zero Client Friction
                    </h5>
                    <p className="text-xs text-[#8892a4] leading-relaxed mt-0.5">
                      No more chasing clients for payments. We ensure prompt, milestone-based payouts.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/agency-partner"
                id="join-agency-partner-btn"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-extrabold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]"
              >
                <span>Join the Partner Network</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
