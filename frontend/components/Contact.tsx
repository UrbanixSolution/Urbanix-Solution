'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle, Phone } from 'lucide-react'
import { submitContactForm, type ContactPayload } from '@/lib/api'

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
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const result = await submitContactForm(form)
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

                <a
                  href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'}`}
                  id="contact-phone-link"
                  className="flex items-center gap-3 p-4 rounded-xl
                             bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                             text-[#8892a4] hover:text-white hover:border-[rgba(255,255,255,0.1)]
                             transition-colors duration-200 group"
                >
                  <Phone size={17} className="text-[#9ab0d8]" />
                  <div>
                    <div className="text-[13px] font-medium group-hover:text-white transition-colors">
                      Request a Callback
                    </div>
                    <div className="text-[11px] text-[#4a5568]">Mon – Sat · 10am – 7pm IST</div>
                  </div>
                </a>
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
                        placeholder="e.g. John Doe"
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
                      placeholder="john@example.com"
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
                    disabled={status === 'loading'}
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
    </section>
  )
}
