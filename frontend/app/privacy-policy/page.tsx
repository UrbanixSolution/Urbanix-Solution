import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Urbanix Solution',
  description: 'Learn how Urbanix Solution handles your personal information, data privacy, and security.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white pt-32 pb-20">
      <div className="section-wrap max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#9ab0d8] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.3)] flex items-center justify-center text-[#9ab0d8]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="label-caps">Legal & Trust</p>
            <h1 className="heading-serif text-3xl sm:text-4xl text-white">Privacy Policy</h1>
          </div>
        </div>

        <p className="text-xs text-[#4a5568] mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm text-[#8892a4] leading-relaxed">
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>
              When you submit inquiries, project briefs, or career applications through Urbanix Solution, we collect contact information such as your name, email address, phone/WhatsApp number, and project requirements.
            </p>
          </section>

          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white">2. How We Use Your Information</h2>
            <p>
              Your information is strictly used to evaluate project requests, communicate project proposals, deliver white-label agency services, and process career/partner applications. We never sell, rent, or trade your data to third parties.
            </p>
          </section>

          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard encryption, SSL protocols, and rate-limiting safeguards to ensure your communications remain confidential and protected.
            </p>
          </section>

          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white">4. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact our team directly at{' '}
              <Link href="/contact" className="text-[#00c4cc] hover:underline font-semibold">
                Urbanix Solution Contact Support
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
