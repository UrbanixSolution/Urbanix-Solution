import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — Urbanix Solution',
  description: 'Read the Terms of Service governing the use of Urbanix Solution website, software development, and digital marketing services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white pt-32 pb-20">
      <div className="section-wrap max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#9ab0d8] hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[rgba(61,90,153,0.15)] border border-[rgba(61,90,153,0.3)] flex items-center justify-center text-[#9ab0d8]">
            <FileText size={20} />
          </div>
          <div>
            <p className="label-caps">Legal Agreements</p>
            <h1 className="heading-serif text-3xl sm:text-4xl text-white">Terms of Service</h1>
          </div>
        </div>

        <p className="text-xs text-[#4a5568] mb-10">Effective Date: July 25, 2026</p>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-[#8892a4] leading-relaxed">
          {/* Section 1 */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">1.</span> Introduction
            </h2>
            <p>
              Welcome to Urbanix Solution. By accessing our website, engaging our software development services, or submitting project proposals, you agree to be bound by these Terms of Service. Please read them carefully before utilizing our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">2.</span> Services Provided
            </h2>
            <p>
              Urbanix Solution provides custom web application development, UI/UX design, e-commerce engineering, API integrations, local SEO, and digital marketing services. All project deliverables and service scopes are specified in individual statement of work (SOW) documents or project agreements signed by client representatives.
            </p>
          </section>

          {/* Section 3 */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">3.</span> User Responsibilities
            </h2>
            <p>
              Clients and website visitors agree to provide accurate information, maintain the security of any granted credentials, and ensure that all content, assets, or media supplied for integration do not infringe upon any third-party intellectual property or copyright laws.
            </p>
          </section>

          {/* Section 4 */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">4.</span> Payment Terms
            </h2>
            <p>
              Project milestones, deposit schedules, and billing cycles are outlined in formal project estimates. Invoices are due according to agreed milestones (e.g., upfront deposit, milestone releases, and final deployment). Failure to meet agreed payment timelines may pause ongoing development or deployment schedules.
            </p>
          </section>

          {/* Section 5 */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">5.</span> Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Urbanix Solution shall not be liable for any indirect, incidental, consequential, or punitive damages resulting from system outages, third-party hosting interruptions, or unauthorized access beyond reasonable control measures.
            </p>
          </section>

          {/* Section 6 - Support & Contact */}
          <section className="card-dark p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#3d5a99]">6.</span> Questions & Legal Inquiries
            </h2>
            <p>
              If you have any questions regarding these Terms of Service or wish to request legal clarification, please contact our support team directly via our{' '}
              <Link href="/contact" className="text-[#00c4cc] hover:underline font-semibold">
                Contact Page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
