import type { Metadata } from 'next'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'Pricing — Urbanix Solution',
  description:
    'Transparent, fixed-price plans for every stage of your business — from MVP landing pages to full-stack SaaS platforms. No hidden fees, full source code ownership.',
}

export default function PricingPage() {
  return (
    <div className="pt-[68px]">
      <Pricing />
    </div>
  )
}
