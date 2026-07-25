import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeedbackWidget from '@/components/FeedbackWidget'

/* ── Serif Display — for headings ─────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

/* ── Sans-Serif — for body & UI ───────────────────────────────── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Urbanix Solution — Premium Websites & Apps for Growing Businesses',
  description:
    'Urbanix Solution builds lightning-fast websites, web apps, and SaaS platforms for startups and enterprises. End-to-end managed tech with startup-friendly pricing.',
  keywords: [
    'web development agency',
    'SaaS development',
    'Next.js agency',
    'Django backend',
    'web app development',
    'startup tech partner',
  ],
  openGraph: {
    title: 'Urbanix Solution — Premium Digital Products',
    description: 'From setup to monthly management — we handle the tech so you can focus on growth.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="bg-[#0b0f19] text-[#f5f5f7] font-sans antialiased overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FeedbackWidget />
      </body>
    </html>
  )
}
