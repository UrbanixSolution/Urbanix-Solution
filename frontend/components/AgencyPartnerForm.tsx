'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, User, Phone, Mail, Globe, Users,
  Send, CheckCircle2, RotateCw, ShieldAlert, FileText, AlertTriangle
} from 'lucide-react'
import { submitAgencyPartnerForm, fetchCaptcha } from '@/lib/api'
import Toast, { type ToastMessage } from '@/components/Toast'

const SERVICE_OPTIONS = [
  'Video Editing',
  'App Development',
  'SEO',
  'Graphic Design',
  'Performance Ads',
  'Custom Software',
  'Other',
]

const TEAM_SIZE_OPTIONS = [
  { value: '1-5', label: '1 - 5 Members (Boutique Team)' },
  { value: '5-15', label: '5 - 15 Members (Mid-Sized Agency)' },
  { value: '15+', label: '15+ Members (Enterprise Scale)' },
]

export default function AgencyPartnerForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    whatsappNumber: '',
    email: '',
    coreServices: 'Video Editing',
    teamSize: '1-5',
    state: '',
    district: '',
    town: '',
    portfolioLink: '',
    proposal: '',
  })

  // State for "Other" custom service input
  const [customService, setCustomService] = useState('')

  // CAPTCHA State with Error Handling
  const [captchaImage, setCaptchaImage] = useState<string>('')
  const [captchaId, setCaptchaId] = useState<string>('')
  const [captchaInput, setCaptchaInput] = useState<string>('')
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false)
  const [captchaError, setCaptchaError] = useState<boolean>(false)

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)

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
    loadCaptcha()
  }, [loadCaptcha])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (captchaError || !captchaImage) {
      setErrorMessage('Failed to load CAPTCHA. Please click retry to generate a new CAPTCHA.')
      return
    }

    if (!captchaInput.trim()) {
      setErrorMessage('Please enter the CAPTCHA text shown in the image.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const finalServices = formData.coreServices === 'Other'
      ? (customService.trim() ? `Other: ${customService.trim()}` : 'Other')
      : formData.coreServices

    try {
      const res = await submitAgencyPartnerForm({
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        whatsapp_number: formData.whatsappNumber,
        email: formData.email,
        core_services: finalServices,
        team_size: formData.teamSize,
        state: formData.state,
        district: formData.district,
        town: formData.town,
        portfolio_link: formData.portfolioLink,
        proposal: formData.proposal,
        captcha_id: captchaId,
        captcha_input: captchaInput,
      })

      if (res.success) {
        setStatus('success')
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Proposal Received!',
          message: 'Thank you! Our agency lead will contact you within 24 hours.',
        })
        setFormData({
          companyName: '',
          contactPerson: '',
          whatsappNumber: '',
          email: '',
          coreServices: 'Video Editing',
          teamSize: '1-5',
          state: '',
          district: '',
          town: '',
          portfolioLink: '',
          proposal: '',
        })
        setCustomService('')
      } else {
        setStatus('error')
        const msg = res.error || 'Failed to submit agency proposal. Please check fields.'
        setErrorMessage(msg)
        setToast({
          id: Date.now().toString(),
          type: 'error',
          title: 'Submission Error',
          message: msg,
        })
      }
    } catch (err: any) {
      setStatus('error')
      const msg = err?.message || 'Failed to submit proposal. Please try again.'
      setErrorMessage(msg)
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Connection Error',
        message: msg,
      })
    } finally {
      loadCaptcha()
    }
  }

  return (
    <div id="agency-form-container" className="max-w-3xl mx-auto py-12">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="card-dark p-8 sm:p-12 border border-[rgba(255,255,255,0.08)] rounded-2xl relative overflow-hidden bg-[#0d1320]">
        
        {/* Top ambient highlight */}
        <div
          className="absolute top-0 inset-x-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #3d5a99, #60a5fa, #10b981)',
          }}
        />

        <div className="mb-8 border-b border-[rgba(255,255,255,0.06)] pb-6">
          <p className="label-caps mb-2 text-[#60a5fa]">B2B Agency Partnership</p>
          <h2 className="heading-serif text-2xl sm:text-3xl text-white">
            Agency Partner Application
          </h2>
          <p className="text-xs text-[#8892a4] mt-1.5 leading-relaxed">
            Fill out your agency capabilities below. We review overflow partnership applications on a rolling 24-hour basis.
          </p>
        </div>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-[rgba(96,165,250,0.15)] border border-[rgba(96,165,250,0.3)] flex items-center justify-center mx-auto text-[#60a5fa]">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white">Partnership Application Received!</h3>
            <p className="text-xs text-[#8892a4] max-w-md mx-auto leading-relaxed">
              Thank you for applying to the Urbanix Solution White-Label Partner Network. Our team will review your portfolio and reach out via WhatsApp/Email to schedule an onboarding call.
            </p>
            <button
              onClick={() => {
                setStatus('idle')
                loadCaptcha()
              }}
              className="btn-ghost text-xs mt-4"
            >
              Submit another agency application
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Company Name & Primary Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="companyName" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#60a5fa]" />
                  Company / Agency Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter your agency or company name"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={13} className="text-[#60a5fa]" />
                  Primary Contact Person <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email & WhatsApp Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={13} className="text-[#60a5fa]" />
                  Business Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your business email address"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={13} className="text-[#60a5fa]" />
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Geolocation Fields: State, District, Town */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="state" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#60a5fa]" />
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter your state"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#60a5fa]" />
                  District <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="district"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Enter your district"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="town" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#60a5fa]" />
                  Town / City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="town"
                  required
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  placeholder="Enter your town or city"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Core Specialization & Team Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="coreServices" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                  Core Specialization <span className="text-red-400">*</span>
                </label>
                <select
                  id="coreServices"
                  required
                  value={formData.coreServices}
                  onChange={(e) => setFormData({ ...formData, coreServices: e.target.value })}
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                >
                  {SERVICE_OPTIONS.map((svc) => (
                    <option key={svc} value={svc} className="bg-[#080c14] text-white">
                      {svc}
                    </option>
                  ))}
                </select>

                {/* Conditional Text Input for "Other" Specialization */}
                {formData.coreServices === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      id="customService"
                      required
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      placeholder="Please specify your agency specialization (e.g. AI Automation, 3D Rendering)..."
                      className="w-full bg-[#080c14] border border-[#60a5fa]/50 focus:border-[#60a5fa] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={13} className="text-[#60a5fa]" />
                  Team Size <span className="text-red-400">*</span>
                </label>
                <select
                  id="teamSize"
                  required
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                >
                  {TEAM_SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#080c14] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Portfolio / Website Link */}
            <div>
              <label htmlFor="portfolioLink" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="text-[#60a5fa]" />
                Agency Website / Portfolio / Case Studies Link <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                id="portfolioLink"
                required
                value={formData.portfolioLink}
                onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                placeholder="https://youragency.com or Drive Case Studies Link"
                className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
              />
            </div>

            {/* Overflow Capacity & Proposal */}
            <div>
              <label htmlFor="proposal" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} className="text-[#60a5fa]" />
                Overflow Capacity & Proposal Pitch
              </label>
              <textarea
                id="proposal"
                rows={4}
                value={formData.proposal}
                onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                placeholder="Briefly describe your team's monthly bandwidth, turnaround speeds, and white-label experience..."
                className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Self-Hosted Text CAPTCHA Widget with Error Fallback */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-[#8892a4] uppercase tracking-wider">
                Human Verification CAPTCHA <span className="text-red-400">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Image Display, Loading Spinner, or Retry Fallback */}
                <div className="flex items-center gap-2 shrink-0">
                  {captchaLoading ? (
                    <div className="h-12 w-[180px] shrink-0 rounded-lg border border-slate-800 bg-[#080c14] animate-pulse flex items-center justify-center text-xs text-slate-500">
                      Loading CAPTCHA...
                    </div>
                  ) : captchaError || !captchaImage ? (
                    <div className="h-12 w-[180px] shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-2 flex items-center justify-between gap-1 text-[11px] font-semibold text-red-400">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={13} className="shrink-0" />
                        Failed
                      </span>
                      <button
                        type="button"
                        onClick={loadCaptcha}
                        className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-white text-[10px] font-bold uppercase transition-colors shrink-0"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <img
                      src={captchaImage}
                      alt="Security CAPTCHA"
                      className="h-12 w-[180px] shrink-0 rounded-lg border border-slate-700 bg-[#0d1320] px-2 py-1 select-none object-fill shadow-inner"
                    />
                  )}

                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                    title="Generate new CAPTCHA"
                    className="h-11 w-11 rounded-lg border border-slate-700 bg-[#080c14] hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0"
                  >
                    <RotateCw size={16} className={captchaLoading ? 'animate-spin' : ''} />
                  </button>
                </div>

                {/* Character Input */}
                <input
                  type="text"
                  id="captchaInputAgency"
                  required
                  disabled={captchaError || !captchaImage}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder={captchaError ? 'Click Retry on left' : 'Enter characters shown above'}
                  className="flex-1 bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-widest placeholder:normal-case placeholder:font-sans placeholder-[#4a5568] focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="agency-submit-btn"
              disabled={status === 'submitting' || !captchaInput.trim() || captchaError || !captchaImage}
              className="w-full py-3.5 rounded-xl bg-[#3d5a99] hover:bg-[#4b6cb7] text-white text-sm font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(61,90,153,0.3)] flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Submitting Proposal...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Agency Partnership Application
                  <Send size={14} />
                </span>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  )
}
