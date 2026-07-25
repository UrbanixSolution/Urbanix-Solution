'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, Send, CheckCircle2, MessageSquare, AlertCircle, Loader2 } from 'lucide-react'
import { submitFeedback } from '@/lib/api'

const FEEDBACK_TYPES = [
  'Bug Report',
  'Feature Request',
  'Design/UI Issue',
  'Other',
]

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('Bug Report')
  const [message, setMessage] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg('Please enter a description for your feedback.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    const result = await submitFeedback({
      feedback_type: feedbackType,
      message: message.trim(),
      contact_info: contactInfo.trim() || undefined,
    })

    setIsSubmitting(false)

    if (result.success) {
      setSuccessMsg('Thanks for helping us improve! Your feedback has been received.')
      setMessage('')
      setContactInfo('')
      setTimeout(() => {
        setSuccessMsg('')
        setIsOpen(false)
      }, 2500)
    } else {
      setErrorMsg(result.error || 'Failed to send feedback. Please try again.')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setErrorMsg('')
    setSuccessMsg('')
  }

  return (
    <>
      {/* ── Floating Action Button (FAB) ────────────────────────── */}
      <button
        type="button"
        id="feedback-fab-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Report Bug or Feedback"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#111827] text-white border border-[rgba(0,196,204,0.4)] shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,196,204,0.2)] hover:border-[#00c4cc] hover:shadow-[0_0_25px_rgba(0,196,204,0.4)] hover:scale-105 transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full bg-[rgba(0,196,204,0.15)] flex items-center justify-center text-[#00c4cc] group-hover:scale-110 transition-transform">
          <Bug size={18} />
        </div>
        <span className="text-xs font-bold tracking-wide text-slate-200 group-hover:text-white hidden sm:inline">
          Report Bug / Feedback
        </span>
      </button>

      {/* ── Modal Dialog Overlay ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,196,204,0.15)] p-6 sm:p-8 z-10 text-left overflow-hidden"
            >
              {/* Top Bar Glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00c4cc] to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[rgba(0,196,204,0.12)] border border-[rgba(0,196,204,0.3)] text-[#00c4cc] flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Website Feedback & Bug Tracker
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Found an issue or have a suggestion? Let us know!
                  </p>
                </div>
              </div>

              {/* Success Message Banner */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Message Banner */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle size={18} className="shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Feedback Type Dropdown */}
                <div>
                  <label htmlFor="feedback-type" className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Feedback Category
                  </label>
                  <select
                    id="feedback-type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs font-semibold outline-none focus:border-[#00c4cc] transition-colors"
                  >
                    {FEEDBACK_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#111827] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Description / Details <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the bug or feature idea in detail..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs leading-relaxed outline-none focus:border-[#00c4cc] transition-colors placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Optional Contact Info */}
                <div>
                  <label htmlFor="feedback-contact" className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Contact Info <span className="text-slate-500 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="feedback-contact"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Email or phone if you'd like a response"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs outline-none focus:border-[#00c4cc] transition-colors placeholder:text-slate-500"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00c4cc] to-[#009da3] hover:from-[#009da3] hover:to-[#008085] text-white text-xs font-bold shadow-[0_0_20px_rgba(0,196,204,0.3)] flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
