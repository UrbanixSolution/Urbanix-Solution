'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Code, Video, Share2, TrendingUp,
  CheckCircle2, Send, MapPin, Building2, ShieldAlert, RotateCw, AlertTriangle
} from 'lucide-react'
import { submitCareerForm, fetchCaptcha } from '@/lib/api'
import Toast, { type ToastMessage } from '@/components/Toast'

const ALL_ROLES = [
  'Frontend Developer (React/Next.js)',
  'Backend Developer (Python/Node.js)',
  'Full-Stack Developer',
  'UI/UX & Web Designer',
  'WordPress / Shopify Expert',
  'App Developer (Flutter/React Native)',
  'Graphic Designer (Canva/Photoshop)',
  'Video Editor (Reels/YouTube)',
  'Social Media Manager',
  'Performance Marketer (Meta/Google Ads)',
  'SEO Specialist (Local & Global)',
  'Content Writer / Copywriter',
  'Telecaller / Lead Generator',
  'IoT & Hardware Prototype Engineer',
  'Data Entry / Virtual Assistant',
  'Other',
]

const FEATURED_ROLES = [
  {
    id: 'role-dev',
    title: 'Full-Stack Web Developer (Next.js / React)',
    icon: Code,
    color: '#9ab0d8',
    type: 'Part-time / Remote',
    description:
      'Build high-performance web applications, landing pages, and interactive UI components for local business clients.',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  },
  {
    id: 'role-video',
    title: 'Video Editor (Reels & Shorts)',
    icon: Video,
    color: '#f59e0b',
    type: 'Contract / Remote',
    description:
      'Edit engaging, high-retention short-form video content and Instagram Reels for local businesses to capture audience attention.',
    skills: ['Premiere Pro', 'CapCut / After Effects', 'Reels Editing', 'Storytelling'],
  },
  {
    id: 'role-social',
    title: 'Social Media Manager & Creator',
    icon: Share2,
    color: '#c4b0d8',
    type: 'Part-time / Remote',
    description:
      'Manage end-to-end client social media handles, design graphic posts, schedule content calendars, and build online brand reputation.',
    skills: ['Canva / Figma', 'Content Strategy', 'Instagram Growth', 'Copywriting'],
  },
  {
    id: 'role-ads',
    title: 'Performance Marketer (Meta/Google Ads)',
    icon: TrendingUp,
    color: '#10b981',
    type: 'Contract / Performance-based',
    description:
      'Design and optimize targeted Meta (Facebook/Instagram) and Google Ad campaigns to generate qualified leads and footfall for local clients.',
    skills: ['Meta Ads Manager', 'Google Ads', 'Lead Gen', 'Conversion Tracking'],
  },
]

export default function CareerForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Frontend Developer (React/Next.js)',
    otherRole: '',
    state: '',
    district: '',
    town: '',
    portfolioUrl: '',
    motivation: '',
  })

  // Self-Hosted Text CAPTCHA State
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

    // Validate CAPTCHA only if it successfully loaded
    if (captchaImage && !captchaError) {
      if (!captchaInput.trim()) {
        setErrorMessage('Please enter the CAPTCHA characters shown in the image.')
        return
      }
    }

    if (formData.role === 'Other' && !formData.otherRole.trim()) {
      setErrorMessage('Please specify your custom skill or primary role.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const finalRole = formData.role === 'Other'
      ? (formData.otherRole.trim() ? `Other: ${formData.otherRole.trim()}` : 'Other')
      : formData.role

    try {
      const res = await submitCareerForm({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role_applied: finalRole,
        state: formData.state,
        district: formData.district,
        town: formData.town,
        portfolio_link: formData.portfolioUrl,
        cover_letter: formData.motivation,
        captcha_id: captchaId,
        captcha_input: captchaInput,
      })

      if (res.success) {
        setStatus('success')
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Application Submitted!',
          message: 'Thank you! We have added you to our talent network.',
        })
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          role: 'Frontend Developer (React/Next.js)',
          otherRole: '',
          state: '',
          district: '',
          town: '',
          portfolioUrl: '',
          motivation: '',
        })
        setCaptchaInput('')
      } else {
        setStatus('error')
        const msg = res.error || 'Submission failed. Please check all fields and try again.'
        setErrorMessage(msg)
        setToast({
          id: Date.now().toString(),
          type: 'error',
          title: 'Submission Error',
          message: msg,
        })
        // Refresh CAPTCHA on error so user gets a new challenge
        loadCaptcha()
      }
    } catch (err: any) {
      console.error('[CareerForm handleSubmit error]:', err)
      setStatus('error')
      const msg = err?.message || 'Cannot connect to server. Please check your internet connection.'
      setErrorMessage(msg)
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Connection Error',
        message: msg,
      })
      loadCaptcha()
    }
  }

  return (
    <div className="section-wrap relative z-10 py-12 md:py-20">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Open Roles Grid ────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="mb-10 text-center sm:text-left">
          <p className="label-caps mb-3">Talent Network</p>
          <h2 className="heading-serif text-3xl sm:text-4xl text-white">
            Current Opportunities
          </h2>
          <p className="text-sm text-[#8892a4] mt-2">
            Flexible, high-impact freelance & part-time roles for developers, designers, and local growth experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_ROLES.map(({ id, title, icon: Icon, color, type, description, skills }) => (
            <motion.div
              key={id}
              id={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark p-6 flex flex-col justify-between border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `color-mix(in srgb, ${color} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                    }}
                  >
                    <Icon size={19} style={{ color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8892a4] bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
                    {type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#9ab0d8] transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-[#8892a4] leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.05)]">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded text-[10px] font-medium text-[#4a5568] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Application Form ───────────────────────────────────────── */}
      <div id="apply-form-section" className="max-w-3xl mx-auto pt-8">
        <div className="card-dark p-8 sm:p-12 border border-[rgba(255,255,255,0.08)] rounded-2xl relative overflow-hidden">
          
          {/* Top ambient highlight */}
          <div
            className="absolute top-0 inset-x-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #3d5a99, #10b981, #f59e0b)',
            }}
          />

          <div className="mb-8">
            <p className="label-caps mb-2">JOIN THE CORE TEAM</p>
            <h2 className="heading-serif text-2xl sm:text-3xl text-white">
              Core Team Direct Application
            </h2>
            <p className="text-xs text-[#8892a4] mt-1">
              Submit your details below to officially apply for a permanent position in the Urbanix Core Team. Only accepted candidates will receive internal CRM access.
            </p>
          </div>


          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white">Application Submitted!</h3>
              <p className="text-xs text-[#8892a4] max-w-md mx-auto leading-relaxed">
                Thank you for applying! Your profile has been added to our local talent pool. We will reach out when a relevant client project opens in your district.
              </p>
              <button
                onClick={() => {
                  setStatus('idle')
                  loadCaptcha()
                }}
                className="btn-ghost text-xs mt-4"
              >
                Submit another application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                    Phone / WhatsApp Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone or WhatsApp number"
                    className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Role Applying For Dropdown */}
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                  Skill / Primary Role <span className="text-red-400">*</span>
                </label>
                <select
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r} className="bg-[#080c14] text-white">
                      {r}
                    </option>
                  ))}
                </select>

                {/* Conditional Text Input when 'Other' is selected */}
                {formData.role === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3.5"
                  >
                    <label htmlFor="otherRole" className="block text-xs font-semibold text-[#00c4cc] mb-2 uppercase tracking-wider">
                      Specify Your Skill / Role <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="otherRole"
                      required={formData.role === 'Other'}
                      value={formData.otherRole}
                      onChange={(e) => setFormData({ ...formData, otherRole: e.target.value })}
                      placeholder="Specify your primary skill or role"
                      className="w-full bg-[#080c14] border border-[#00c4cc]/40 focus:border-[#00c4cc] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                    />
                  </motion.div>
                )}
              </div>

              {/* Geolocation Fields: State, District, Town */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={13} className="text-[#00c4cc]" />
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter your state"
                    className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#00c4cc]" />
                    District <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Enter your district"
                    className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="town" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#00c4cc]" />
                    Town / City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="town"
                    required
                    value={formData.town}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    placeholder="Enter your town or city"
                    className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Portfolio / Resume Link */}
              <div>
                <label htmlFor="portfolioUrl" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                  Portfolio / Resume / Work Sample Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  required
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourportfolio.com or Drive Link"
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors"
                />
              </div>

              {/* Motivation Textarea */}
              <div>
                <label htmlFor="motivation" className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wider">
                  Why do you want to join us? <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="motivation"
                  rows={4}
                  required
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Tell us briefly about your experience, past projects, or local growth skills..."
                  className="w-full bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#3d5a99] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Self-Hosted Text CAPTCHA Widget */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
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
                    id="captchaInput"
                    required
                    disabled={captchaError || !captchaImage}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder={captchaError ? 'Click Retry on left' : 'Enter characters shown above'}
                    className="flex-1 bg-[#080c14] border border-[rgba(255,255,255,0.08)] focus:border-[#00c4cc] rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-widest placeholder:normal-case placeholder:font-sans placeholder-[#4a5568] focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button — only disabled while actively submitting, never permanently blocked by CAPTCHA load failure */}
              <button
                type="submit"
                id="career-submit-btn"
                disabled={status === 'submitting' || (!!captchaImage && !captchaError && !captchaInput.trim())}
                className="btn-solid w-full justify-center py-3.5 text-sm font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Application
                    <Send size={14} />
                  </span>
                )}
              </button>

            </form>
          )}

        </div>
      </div>

    </div>
  )
}
