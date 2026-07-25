import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-[#f5f5f7] px-6 py-24">
      <div className="max-w-md text-center">
        <p className="label-caps mb-4 text-[#00c4cc]">404 Error</p>
        <h1 className="heading-serif text-4xl sm:text-5xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="body-text text-slate-400 text-sm mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="btn-solid inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </main>
  )
}
