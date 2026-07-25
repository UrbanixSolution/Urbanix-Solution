'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'

const FOOTER_COLUMNS = [
  {
    title: 'Development',
    links: [
      { label: 'Web Development', href: '/services' },
      { label: 'E-Commerce', href: '/services' },
      { label: 'UI/UX Design', href: '/services' },
      { label: 'Custom Web Apps', href: '/services' },
    ],
  },
  {
    title: 'Marketing',
    links: [
      { label: 'Local SEO', href: '/services' },
      { label: 'Performance Ads', href: '/services' },
      { label: 'Social Media', href: '/services' },
      { label: 'WhatsApp Marketing', href: '/services' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Maintenance', href: '/services' },
      { label: 'AI Bots', href: '/services' },
      { label: 'API Integrations', href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Work', href: '/work/local-business' },
      { label: 'Career', href: '/career' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

const SOCIALS = [
  {
    icon: Instagram,
    href: 'https://www.instagram.com/urbanix_solution/',
    label: 'Instagram',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/135278416',
    label: 'LinkedIn',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] bg-[#080c14] text-white">
      <div className="section-wrap py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Column (Spans 2 cols on lg) */}
          <div className="lg:col-span-2">
            <Link href="/" id="footer-logo" className="flex items-center mb-5 group w-fit">
              <Image
                src="/urbanix-logo.png"
                alt="Urbanix Solution Logo"
                width={150}
                height={40}
                className="h-9 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
              />
            </Link>

            <p className="text-[13px] text-[#8892a4] leading-relaxed max-w-xs mb-6">
              Building high-performance digital products, scalable web apps, and data-driven marketing campaigns for ambitious businesses worldwide.
            </p>

            {/* Social Media Links with Hover Glow */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  id={`footer-social-${label.toLowerCase()}`}
                  className="w-10 h-10 rounded-xl border border-white/10
                             flex items-center justify-center text-[#8892a4]
                             hover:text-[#00c4cc] hover:border-[#00c4cc]/50 hover:bg-[#00c4cc]/10
                             hover:shadow-[0_0_20px_rgba(0,196,204,0.3)]
                             transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Categorized 4 Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-[#8892a4] hover:text-[#00c4cc] transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row
                       items-center justify-between gap-3">
          <p className="text-[12px] text-[#8892a4]">
            © 2026 Urbanix Solution. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/contact" className="text-[12px] text-[#8892a4] hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-[12px] text-[#8892a4] hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
