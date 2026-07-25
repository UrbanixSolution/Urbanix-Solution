import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'

const LogoTicker        = dynamic(() => import('@/components/LogoTicker'))
const MetricsBanner     = dynamic(() => import('@/components/MetricsBanner'))
const ValueProposition  = dynamic(() => import('@/components/ValueProposition'))
const ServicesGrid      = dynamic(() => import('@/components/ServicesGrid'))
const SimpleProcess     = dynamic(() => import('@/components/SimpleProcess'))
const PortfolioShowcase = dynamic(() => import('@/components/PortfolioShowcase'))
const FAQSection        = dynamic(() => import('@/components/FAQSection'))
const TrustCTA          = dynamic(() => import('@/components/TrustCTA'))

export default function Home() {
  return (
    <>
      {/* 1. Hero — dark theme, full-height */}
      <Hero />

      {/* 2. Logo Ticker — scrolling brand strip */}
      <LogoTicker />

      {/* 3. Metrics/Trust Banner — 6-metric grid */}
      <MetricsBanner />

      {/* 4. Value Proposition — light contrast split layout */}
      <ValueProposition />

      {/* 5. Services Grid — 360° Digital Growth Solutions */}
      <ServicesGrid />

      {/* 6. Our Simple 3-Step Process */}
      <SimpleProcess />

      {/* 7. Live Portfolio Showcase — case study focus & real results */}
      <PortfolioShowcase />

      {/* 8. Interactive FAQ Accordion — jargon-free Q&A for local business owners */}
      <FAQSection />

      {/* 9. Trust-Based Call-to-Action — Free Digital Growth Audit */}
      <TrustCTA />
    </>
  )
}
