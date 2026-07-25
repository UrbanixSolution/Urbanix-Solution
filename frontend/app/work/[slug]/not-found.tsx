import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'

export default function WorkNotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8
                        bg-[rgba(61,90,153,0.1)] border border-[rgba(61,90,153,0.2)] text-[#4a5568]">
          <Briefcase size={28} />
        </div>

        {/* Error code */}
        <p className="label-caps mb-3 text-[#3d5a99]">404 — Category Not Found</p>

        {/* Heading */}
        <h1 className="heading-serif text-[2rem] mb-4">
          This portfolio category{' '}
          <span className="heading-serif-italic">doesn't exist</span>
        </h1>

        {/* Description */}
        <p className="text-[#8892a4] text-[0.9rem] leading-relaxed mb-8">
          The work category you're looking for may have changed. Browse our full portfolio
          to see what we've shipped.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/work"
            id="work-404-browse"
            className="btn-solid"
          >
            Browse All Work
          </Link>
          <Link
            href="/"
            id="work-404-home"
            className="btn-ghost"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
