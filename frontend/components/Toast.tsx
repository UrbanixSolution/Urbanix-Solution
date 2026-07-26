'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react'

export type ToastMessage = {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastMessage | null
  onClose: () => void
}) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-20 right-4 sm:right-6 z-[100] mt-4 max-w-md w-full px-4 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-3 bg-[#0d1424]/95 border-[rgba(255,255,255,0.1)] text-white"
        >
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center text-[#10b981] shrink-0">
              <CheckCircle2 size={18} />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-8 h-8 rounded-xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center text-[#ef4444] shrink-0">
              <AlertCircle size={18} />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-xl bg-[rgba(0,196,204,0.15)] border border-[rgba(0,196,204,0.3)] flex items-center justify-center text-[#00c4cc] shrink-0">
              <Info size={18} />
            </div>
          )}

          <div className="flex-1 pr-2">
            <h4 className="text-xs font-semibold text-white leading-snug">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-[11px] text-[#8892a4] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close notification"
            className="text-[#4a5568] hover:text-white transition-colors p-1"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
