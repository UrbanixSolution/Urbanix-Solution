import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Contact = dynamic(() => import('@/components/Contact'))

export const metadata: Metadata = {
  title: 'Contact — Urbanix Solution',
  description:
    'Start a project with Urbanix Solution. Get a fixed-price quote, direct communication, and a tailored proposal within 24 hours.',
}

export default function ContactPage() {
  return (
    <div className="pt-[68px]">
      <Contact />
    </div>
  )
}
