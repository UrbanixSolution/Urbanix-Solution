import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeedbackWidget from '@/components/FeedbackWidget'
import ScrollRestoration from '@/components/ScrollRestoration'

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
  metadataBase: new URL('https://urbanixsolution.online'),
  title: 'Urbanix Solution | Tech Growth Partner for Businesses',
  description:
    'Urbanix Solution helps local businesses and startups transition online with web development, automation, and complete technical support. We also empower a dynamic freelancer network.',
  keywords: [
    'Urbanix Solution',
    'Web Agency',
    'Digital Tech Partner',
    'Automation',
    'Freelancer Network',
    'Web Development',
  ],
  icons: {
    icon: [
      { url: '/urbanix-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/urbanix-logo.png',
    apple: '/urbanix-logo.png',
  },
  openGraph: {
    title: 'Urbanix Solution | Tech Growth Partner',
    description:
      'Get your offline business online with our complete digital solutions, or join our exclusive freelancer talent network today.',
    type: 'website',
    url: 'https://urbanixsolution.online',
    images: ['/urbanix-logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#0b0f19] text-[#f5f5f7] font-sans antialiased overflow-x-hidden">
        <ScrollRestoration />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FeedbackWidget />
      </body>
    </html>
  )
}
