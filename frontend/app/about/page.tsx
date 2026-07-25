import type { Metadata } from 'next'
import AboutHero from '@/components/AboutHero'
import HowWeWork from '@/components/HowWeWork'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title: 'About Us — Urbanix Solution',
  description:
    'Empowering Local Businesses, Driven by Young Talent. Urbanix Solution helps local businesses and offline startups bridge the digital gap with websites, Reels, and ad campaigns.',
}

export default function AboutPage() {
  return (
    <div className="pt-[68px]">
      {/* 1. Mission Statement Section (Top) */}
      <AboutHero />

      {/* 2. How We Work Process Section */}
      <HowWeWork />

      {/* 3. Frequently Asked Questions Accordion */}
      <FAQSection />
    </div>
  )
}
