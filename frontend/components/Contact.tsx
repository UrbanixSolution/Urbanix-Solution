'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle, Phone, RotateCw, ShieldAlert, AlertTriangle, X } from 'lucide-react'
import { submitContactForm, submitCallbackForm, fetchCaptcha, type ContactPayload } from '@/lib/api'

const SERVICE_OPTIONS = [
  { value: 'business-websites', label: 'Business Websites' },
  { value: 'e-commerce', label: 'E-Commerce Setup' },
  { value: 'video-editing', label: 'Reels & Video Editing' },
  { value: 'performance-ads', label: 'Performance Ads' },
  { value: 'local-seo', label: 'Local SEO' },
  { value: 'maintenance', label: 'Maintenance & Support' },
  { value: 'other', label: 'Other / Custom Project' },
]

type FormState = {
  name: string
  email: string
  phone: string
  service_interested: string
  message: string
}
import Toast, { type ToastMessage } from '@/components/Toast'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service_interested: 'business-websites',
    message: '',
  })

  // Callback Modal State
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', state: '', district: '', town: '' })
  const [isCallbackSubmitting, setIsCallbackSubmitting] = useState(false)
  const [callbackError, setCallbackError] = useState('')
  const [callbackSuccess, setCallbackSuccess] = useState('')

  // Self-Hosted Text CAPTCHA State
  const [captchaImage, setCaptchaImage] = useState<string>('')
  const [captchaId, setCaptchaId] = useState<string>('')
  const [captchaInput, setCaptchaInput] = useState<string>('')
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false)
  const [captchaError, setCaptchaError] = useState<boolean>(false)

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) {
      setCallbackError('Please enter both your name and phone number.')
      return
    }

    setIsCallbackSubmitting(true)
    setCallbackError('')

    try {
      const res = await submitCallbackForm({
        name: callbackForm.name.trim(),
        phone: callbackForm.phone.trim(),
        state: callbackForm.state.trim(),
        district: callbackForm.district.trim(),
        town: callbackForm.town.trim(),
      })

      if (res.success) {
        setCallbackSuccess('Callback request submitted successfully!')
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Callback Requested!',
          message: 'Our team will call you back within operating hours.',
        })
        setCallbackForm({ name: '', phone: '', state: '', district: '', town: '' })
        setTimeout(() => {
          setCallbackSuccess('')
          setIsCallbackModalOpen(false)
        }, 2000)
      } else {
        setCallbackError(res.error || 'Failed to submit callback request.')
      }
    } catch (err: any) {
      setCallbackError(err?.message || 'Connection error. Please try again.')
    } finally {
      setIsCallbackSubmitting(false)
    }
  }

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (captchaError || !captchaImage) {
      setErrorMsg('Failed to load CAPTCHA. Please click retry to generate a new CAPTCHA.')
      return
    }

    if (!captchaInput.trim()) {
      setErrorMsg('Please enter the CAPTCHA text shown in the image.')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const result = await submitContactForm({
        ...form,
        captcha_id: captchaId,
        captcha_input: captchaInput,
      })
      if (result.success) {
        setStatus('success')
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Inquiry Submitted!',
          message: 'Our engineering team will contact you within 24 hours.',
        })
        setForm({
          name: '',
          email: '',
          phone: '',
          service_interested: 'business-websites',
          message: '',
        })
      } else {
        setStatus('error')
        const msg = result.error || 'Submission failed. Please check form fields.'
        setErrorMsg(msg)
        setToast({
          id: Date.now().toString(),
          type: 'error',
          title: 'Submission Failed',
          message: msg,
        })
      }
    } catch (err: unknown) {
      console.error('[Contact Form Submission Error]:', err)
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setErrorMsg(msg)
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
    <section id="contact" className="section-py border-t border-[rgba(255,255,255,0.05)]">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="section-wrap">
        <div className="max-w-5xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="label-caps mb-3">Start a Project</p>
            <h2 className="heading-serif text-3xl sm:text-4xl">
              Let's Build Something
              <br />
              <span className="heading-serif-italic">Remarkable Together</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Left — Contact Info & Direct Links */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <ul className="space-y-3">
                {[
                  'Fixed-price quotes — no surprise invoices',
                  'Direct communication with lead engineers',
                  'Full code & data ownership from day one',
                  'Ongoing support even after launch',
                  'AI-ready architecture for future scaling',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-[13px] text-[#8892a4]">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-[#9ab0d8]" />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-link"
                  className="flex items-center gap-3 p-4 rounded-xl
                             bg-[rgba(61,153,122,0.08)] border border-[rgba(61,153,122,0.15)]
                             text-[#90c8b8] hover:bg-[rgba(61,153,122,0.12)]
                             transition-colors duration-200 group"
                >
                  <MessageCircle size={17} />
                  <div>
                    <div className="text-[13px] font-medium group-hover:text-white transition-colors">
                      Message on WhatsApp
                    </div>
                    <div className="text-[11px] text-[#4a5568]">Instant Chat & Consultation</div>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => setIsCallbackModalOpen(true)}
                  id="contact-phone-link"
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-left
                             bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                             text-[#8892a4] hover:text-white hover:border-[rgba(255,255,255,0.1)]
                             transition-colors duration-200 group cursor-pointer"
                >
                  <Phone size={17} className="text-[#9ab0d8]" />
                  <div>
                    <div className="text-[13px] font-medium group-hover:text-white transition-colors">
                      Request a Callback
                    </div>
                    <div className="text-[11px] text-[#4a5568]">Mon – Sat · 10am – 7pm IST</div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-3"
            >
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  id="contact-success-state"
                  className="card-dark h-full flex flex-col items-center justify-center
                             text-center py-14 px-8 min-h-[320px]"
                >
                  <div
                    className="w-14 h-14 rounded-full bg-[rgba(61,153,122,0.12)]
                                  border border-[rgba(61,153,122,0.2)]
                                  flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={24} className="text-[#90c8b8]" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">
                    Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-[13px] text-[#8892a4] max-w-xs leading-relaxed">
                    Thank you! Our engineering team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    id="contact-send-another"
                    className="mt-6 text-[12px] text-[#9ab0d8] hover:text-white transition-colors"
                  >
                    Send another inquiry →
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form" className="card-dark p-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[11px] font-medium text-[#4a5568] mb-1.5 tracking-wide uppercase"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-[11px] font-medium text-[#4a5568] mb-1.5 tracking-wide uppercase"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone or WhatsApp number"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] font-medium text-[#4a5568] mb-1.5 tracking-wide uppercase"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-[11px] font-medium text-[#4a5568] mb-1.5 tracking-wide uppercase"
                    >
                      Service Required *
                    </label>
                    <select
                      id="contact-service"
                      name="service_interested"
                      required
                      value={form.service_interested}
                      onChange={handleChange}
                      className="form-input appearance-none"
                    >
                      {SERVICE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value} className="bg-[#111827]">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] font-medium text-[#4a5568] mb-1.5 tracking-wide uppercase"
                    >
                      Project Brief / Details
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your goals, requirements, or target timeline..."
                      className="form-input resize-none"
                    />
                  </div>

                  {/* Self-Hosted Text CAPTCHA Widget */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <label className="block text-[11px] font-medium text-[#4a5568] uppercase tracking-wide">
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
                        id="contactCaptchaInput"
                        required
                        disabled={captchaError || !captchaImage}
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        maxLength={6}
                        placeholder={captchaError ? 'Click Retry on left' : 'Enter characters'}
                        className="flex-1 form-input font-mono uppercase tracking-widest placeholder:normal-case placeholder:font-sans placeholder-[#4a5568] focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="contact-error-message"
                      className="flex items-center gap-2 text-[13px] text-[#e5a0a0]
                                 bg-[rgba(229,100,100,0.08)] border border-[rgba(229,100,100,0.15)]
                                 rounded-lg px-4 py-3"
                    >
                      <AlertCircle size={14} />
                      {errorMsg}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !captchaInput.trim() || captchaError || !captchaImage}
                    id="contact-submit-btn"
                    className="w-full btn-solid justify-center py-3 text-[13px]
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Submitting…
                      </>
                    ) : (
                      <>
                        Send Inquiry <Send size={13} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#2a3040]">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Callback Request Popup Modal ──────────────────────────── */}
      <AnimatePresence>
        {isCallbackModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCallbackModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Centered Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-3xl bg-[#111827] border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(61,90,153,0.15)] p-6 sm:p-8 z-10 text-left overflow-hidden"
            >
              {/* Top Accent Glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3d5a99] to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsCallbackModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.3)] text-[#9ab0d8] flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Request a Callback
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We will call you back within 10am – 7pm IST.
                  </p>
                </div>
              </div>

              {callbackSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{callbackSuccess}</h4>
                  <p className="text-xs text-slate-400">Closing window...</p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="callback-name" className="block text-[11px] font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                      Full Name *
                    </label>
                    <input
                      id="callback-name"
                      type="text"
                      required
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="callback-phone" className="block text-[11px] font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      id="callback-phone"
                      type="tel"
                      required
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      placeholder="Enter your phone or WhatsApp number"
                      className="form-input"
                    />
                  </div>

                  {/* Geolocation Fields: State, District, Town */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="callback-state" className="block text-[11px] font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                        State *
                      </label>
                      <input
                        id="callback-state"
                        type="text"
                        required
                        value={callbackForm.state}
                        onChange={(e) => setCallbackForm({ ...callbackForm, state: e.target.value })}
                        placeholder="Enter your state"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="callback-district" className="block text-[11px] font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                        District *
                      </label>
                      <input
                        id="callback-district"
                        type="text"
                        required
                        value={callbackForm.district}
                        onChange={(e) => setCallbackForm({ ...callbackForm, district: e.target.value })}
                        placeholder="Enter your district"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label htmlFor="callback-town" className="block text-[11px] font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                        Town / City *
                      </label>
                      <input
                        id="callback-town"
                        type="text"
                        required
                        value={callbackForm.town}
                        onChange={(e) => setCallbackForm({ ...callbackForm, town: e.target.value })}
                        placeholder="Enter your town or city"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>

                  {callbackError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{callbackError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCallbackModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCallbackSubmitting}
                      className="btn-solid py-2.5 px-5 text-xs font-semibold justify-center disabled:opacity-50"
                    >
                      {isCallbackSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        'Submit Callback Request'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
