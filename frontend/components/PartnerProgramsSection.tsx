'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Building2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Coins,
  Rocket,
  Users,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  X,
  CheckCircle2,
  AlertCircle,
  Zap,
  Send,
  RotateCw,
  AlertTriangle
} from 'lucide-react'
import { submitCallPartnerApplication, fetchCaptcha } from '@/lib/api'

export default function PartnerProgramsSection() {
  // Modal state for Call Partner Program
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Captcha State
  const [captchaId, setCaptchaId] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true)
    setCaptchaError(false)
    try {
      const res = await fetchCaptcha()
      if (res && res.image_base64) {
        setCaptchaId(res.captcha_id)
        setCaptchaImage(res.image_base64)
        setCaptchaInput('')
        setCaptchaError(false)
      } else {
        setCaptchaError(true)
      }
    } catch (err) {
      console.error('Failed to load CAPTCHA:', err)
      setCaptchaError(true)
    } finally {
      setCaptchaLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      loadCaptcha()
    }
  }, [isModalOpen, loadCaptcha])

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!fullName.trim() || !email.trim() || !whatsappNumber.trim()) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (!captchaInput.trim()) {
      setErrorMessage('Please enter the CAPTCHA characters shown in the image.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitCallPartnerApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        whatsapp_number: whatsappNumber.trim(),
        captcha_id: captchaId,
        captcha_input: captchaInput.trim(),
      })

      if (res.success) {
        setSuccessMessage('Application submitted successfully! Our team will review your application and email your partner credentials within 24 hours.')
        setFullName('')
        setEmail('')
        setWhatsappNumber('')
        setCaptchaInput('')
      } else {
        setErrorMessage(res.error || 'Failed to submit application. Please try again.')
        loadCaptcha()
      }
    } catch (err: any) {
      setErrorMessage('Network error. Please check your connection and try again.')
      loadCaptcha()
    } finally {
      setIsSubmitting(false)
    }
  }


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

        {/* ── Section Sub-header ─────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Choose Your Partner Path</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            High-Impact Opportunities for <span className="text-cyan-400 italic">Builders, Agencies & Referrers</span>
          </h2>
        </div>

        {/* ── 3-Column Modern Program Cards Grid ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

          {/* ── CARD 1: Student Partner Program ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 hover:border-cyan-500/40 shadow-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-400 transition-all duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                  <GraduationCap size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  Students & Devs
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5">
                Student Partner
              </h3>

              <h4 className="text-sm font-extrabold text-cyan-300 mb-3 leading-tight">
                Stop building dummy projects. Code for real clients.
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Earn pocket money, build a killer portfolio, and get real-world industry experience right from your hostel room.
              </p>

              <div className="space-y-3 mb-6 border-t border-slate-800/80 pt-4">
                <div className="flex items-start gap-2.5">
                  <Coins size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Earn While You Learn:</strong> Get paid per milestone.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Rocket size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Real-World Code:</strong> Live client web apps.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Exclusive Network:</strong> Direct CD reviews.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/student-partner"
                className="w-full py-3 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Apply to Earn & Learn</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>


          {/* ── CARD 2: Agency Partner Program ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 hover:border-blue-500/40 shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300"
          >
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400 transition-all duration-500" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300">
                  <Building2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
                  Freelancers & Agencies
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5">
                Agency Partner
              </h3>

              <h4 className="text-sm font-extrabold text-blue-300 mb-3 leading-tight">
                Tired of hunting clients? We bring projects to you.
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                We handle meetings, negotiations, and client management. You focus on design and code.
              </p>

              <div className="space-y-3 mb-6 border-t border-slate-800/80 pt-4">
                <div className="flex items-start gap-2.5">
                  <TrendingUp size={15} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Consistent Work:</strong> High-ticket projects.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">100% White-Label:</strong> Private collaboration.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CreditCard size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Zero Friction:</strong> Guaranteed milestone payouts.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/agency-partner"
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <span>Join Partner Network</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>


          {/* ── CARD 3: Call Partner Program (NEW) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl p-6 sm:p-7 hover:border-emerald-400/50 shadow-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300"
          >
            {/* Top highlight bar */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent group-hover:via-emerald-300 transition-all duration-500" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300">
                  <PhoneCall size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                  Zero Coding Required
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-1.5">
                <span>Call Partner Program</span>
                <Zap size={16} className="text-amber-400 fill-amber-400" />
              </h3>

              <h4 className="text-sm font-extrabold text-emerald-300 mb-3 leading-tight">
                Zero coding. Bring client leads and earn flat commissions in 48 hours.
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Connect local business leads or client projects with our core team. We close the deal and payout your flat commission directly to your bank.
              </p>

              <div className="space-y-3 mb-6 border-t border-emerald-900/60 pt-4">
                <div className="flex items-start gap-2.5">
                  <PhoneCall size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Zero Technical Coding:</strong> Just refer leads.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Zap size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">48-Hour Payout:</strong> Instant commission release.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <TrendingUp size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><strong className="text-white">Lead Dashboard:</strong> Real-time pipeline tracker.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(true)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
              >
                <span>Join as Call Partner</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>

      {/* ── Call Partner Application Modal / Dialog ───────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Top ambient highlight line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <PhoneCall size={13} />
                  <span>Call Partner Program</span>
                </div>
                <h3 className="text-xl font-bold text-white">Join as Call Partner</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details below to receive your partner referral kit and dashboard login credentials.
                </p>
              </div>

              {/* Success View */}
              {successMessage ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white">Application Received!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {successMessage}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-colors"
                  >
                    Close Dialog
                  </button>
                </div>
              ) : (
                /* Modal Form */
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Enter your WhatsApp phone number"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Self-Hosted Text CAPTCHA Widget */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Human Verification CAPTCHA <span className="text-red-400">*</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="flex items-center gap-2 shrink-0">
                        {captchaLoading ? (
                          <div className="h-10 w-[150px] shrink-0 rounded-lg border border-slate-800 bg-[#080c14] animate-pulse flex items-center justify-center text-[10px] text-slate-500">
                            Loading CAPTCHA...
                          </div>
                        ) : captchaError || !captchaImage ? (
                          <div className="h-10 w-[150px] shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-2 flex items-center justify-between gap-1 text-[10px] font-semibold text-red-400">
                            <span className="flex items-center gap-1">
                              <AlertTriangle size={12} className="shrink-0" />
                              Failed
                            </span>
                            <button
                              type="button"
                              onClick={loadCaptcha}
                              className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-white text-[9px] font-bold uppercase transition-colors shrink-0"
                            >
                              Retry
                            </button>
                          </div>
                        ) : (
                          <img
                            src={captchaImage}
                            alt="Security CAPTCHA"
                            className="h-10 w-[150px] shrink-0 rounded-lg border border-slate-700 bg-[#0d1320] px-2 py-1 select-none object-fill shadow-inner"
                          />
                        )}

                        <button
                          type="button"
                          onClick={loadCaptcha}
                          disabled={captchaLoading}
                          title="Generate new CAPTCHA"
                          className="h-10 w-10 rounded-lg border border-slate-700 bg-[#080c14] hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0"
                        >
                          <RotateCw size={14} className={captchaLoading ? 'animate-spin' : ''} />
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter CAPTCHA text"
                        className="w-full px-3 py-2 bg-[#080c14] border border-slate-800 focus:border-emerald-400 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>


                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

