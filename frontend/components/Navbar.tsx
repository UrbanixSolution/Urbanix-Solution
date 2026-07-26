'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ArrowRight, ChevronDown,
  Globe, ShoppingCart, Video, Target, MapPin, ShieldCheck,
  Store, GraduationCap, User, Briefcase, Tag, Palette, Layers, Bot
} from 'lucide-react'
import { fetchServices, fetchCategories, type ApiService, type ApiCategory } from '@/lib/api'

// ─────────────────────────────────────────────────────────────
// Lucide Icon Mapping Dictionary
// ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  ShoppingCart,
  Video,
  Target,
  MapPin,
  ShieldCheck,
  Store,
  GraduationCap,
  User,
  Palette,
  Layers,
  Bot,
  Layout: Globe,
  Film: Video,
  Search: MapPin,
  Wrench: ShieldCheck,
}

// ─────────────────────────────────────────────────────────────
// Default Fallback Data (Prevents UI crash if backend is down)
// ─────────────────────────────────────────────────────────────

type MegaItem = {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  href: string
  description: string
}

const DEFAULT_SERVICES: MegaItem[] = [
  {
    id: 'mm-business-websites',
    icon: Globe,
    title: 'Business Websites',
    subtitle: 'Landing pages · From ₹2,999',
    href: '/services/business-websites',
    description: 'Custom landing pages and business websites built for maximum conversions.',
  },
  {
    id: 'mm-ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce Setup',
    subtitle: 'Stores & payments · From ₹9,999',
    href: '/services/e-commerce',
    description: 'Turnkey digital storefronts with secure payment integrations and inventory sync.',
  },
  {
    id: 'mm-ui-ux',
    icon: Palette,
    title: 'UI/UX Design',
    subtitle: 'Figma & design · From ₹1,499',
    href: '/services/ui-ux-design',
    description: 'Pixel-perfect UI design systems, wireframes, and conversion-focused user experiences.',
  },
  {
    id: 'mm-custom-web-apps',
    icon: Layers,
    title: 'Custom Web Applications',
    subtitle: 'SaaS & Dashboards · From ₹14,999',
    href: '/services/custom-web-apps',
    description: 'Scalable web apps, admin dashboards, and custom SaaS platforms built with Next.js.',
  },
  {
    id: 'mm-reels-video',
    icon: Video,
    title: 'Reels & Video Editing',
    subtitle: 'Social media edits · From ₹999/mo',
    href: '/services/video-editing',
    description: 'High-impact short-form video reels, promotional edits, and brand stories.',
  },
  {
    id: 'mm-performance-ads',
    icon: Target,
    title: 'Performance Ads',
    subtitle: 'Google & Meta ads · From ₹5,000/mo',
    href: '/services/performance-ads',
    description: 'Data-driven paid ad campaigns designed to maximize ROI and customer acquisition.',
  },
  {
    id: 'mm-local-seo',
    icon: MapPin,
    title: 'Local SEO',
    subtitle: 'Google Maps ranking · From ₹1,999/mo',
    href: '/services/local-seo',
    description: 'Dominate local searches, Google Maps pack, and drive foot traffic to your business.',
  },
  {
    id: 'mm-ai-chatbots',
    icon: Bot,
    title: 'AI Chatbots & Bots',
    subtitle: 'Automated AI support · From ₹7,999',
    href: '/services/ai-chatbots',
    description: 'AI-powered customer support bots, LLM integrations, and automated lead capture.',
  },
]

const DEFAULT_CATEGORIES: MegaItem[] = [
  {
    id: 'mm-local-business',
    icon: Store,
    title: 'Local Business',
    subtitle: 'Service & Retail Websites',
    href: '/work/local-business',
    description: 'High-converting custom websites for local service providers and retail stores.',
  },
  {
    id: 'mm-education',
    icon: GraduationCap,
    title: 'Education & Communities',
    subtitle: 'Learning & Workspace Platforms',
    href: '/work/education',
    description: 'Interactive learning platforms, LMS, and community spaces.',
  },
  {
    id: 'mm-portfolios',
    icon: User,
    title: 'Personal Portfolios',
    subtitle: 'Resumes & Creator Sites',
    href: '/work/portfolios',
    description: 'Sleek, responsive portfolios for creators, executives, and professionals.',
  },
]

const TOP_NAV = [
  { label: 'Home', href: '/', hasMega: false },
  { label: 'Services', href: '/services', hasMega: true, megaKey: 'services' },
  { label: 'Work', href: '#work', hasMega: true, megaKey: 'work' },
  { label: 'About', href: '/about', hasMega: false },
  { label: 'Career', href: '/career', hasMega: false },
  { label: 'Contact', href: '/contact', hasMega: false },
]

// ─────────────────────────────────────────────────────────────
// Mega Menu Dropdown Panel
// ─────────────────────────────────────────────────────────────

function DropdownPanel({
  items,
  onClose,
  label,
}: {
  items: MegaItem[]
  onClose: () => void
  label: string
}) {
  const isCompact = items.length <= 4
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100] ${isCompact ? 'w-[440px]' : 'w-[640px]'
        } max-w-3xl bg-[#0b0f19] border border-slate-800
                 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.03)_inset]
                 rounded-xl overflow-hidden p-4 text-left`}
    >
      <div className={`grid ${isCompact ? 'grid-cols-1 gap-1.5' : 'grid-cols-2 gap-2'}`}>
        {items.map(({ id, icon: Icon, title, subtitle, href }) => (
          <Link
            key={id}
            href={href}
            id={id}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/40 transition-all group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center 
                            bg-slate-800/80 border border-slate-700/50 text-[#9ab0d8] 
                            group-hover:bg-[#3d5a99]/20 group-hover:border-[#3d5a99]/40 group-hover:text-white transition-all duration-200">
              <Icon size={14} className="transition-transform duration-200 group-hover:scale-105" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-semibold text-white group-hover:text-[#9ab0d8] transition-colors">
                {title}
              </span>
              {subtitle && (
                <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] px-1">
        <Link
          href="/contact"
          onClick={onClose}
          id="dropdown-footer-start"
          className="flex items-center gap-1 text-[#9ab0d8] hover:text-white font-semibold transition-colors group/foot"
        >
          <Briefcase size={11} />
          Start a project
          <ArrowRight size={10} className="group-hover/foot:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href={label === 'Services' ? '/services' : '/work/local-business'}
          onClick={onClose}
          id="nav-dropdown-view-all"
          className="text-[#00c4cc] hover:text-white font-semibold transition-colors flex items-center gap-1"
        >
          {label === 'Services' ? 'View All Services →' : 'Explore work'}
        </Link>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Navbar Component
// ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  // Dynamic state populated from Django API
  const [services, setServices] = useState<MegaItem[]>(DEFAULT_SERVICES)
  const [categories, setCategories] = useState<MegaItem[]>(DEFAULT_CATEGORIES)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch Services & Categories dynamically from Django DRF API
  useEffect(() => {
    let isMounted = true
    async function loadNavData() {
      try {
        const [apiServices, apiCategories] = await Promise.all([
          fetchServices(),
          fetchCategories(),
        ])

        if (isMounted) {
          if (apiServices && apiServices.length > 0) {
            const mappedServices: MegaItem[] = apiServices.map((s: ApiService) => ({
              id: `nav-service-${s.id}-${s.slug}`,
              icon: (s.icon_name && ICON_MAP[s.icon_name]) || Globe,
              title: s.title,
              subtitle: s.short_description
                ? (s.short_description.length > 36 ? s.short_description.slice(0, 36) + '…' : s.short_description)
                : 'Service offering',
              href: `/services/${s.slug}`,
              description: s.short_description || '',
            }))
            setServices(mappedServices)
          }

          if (apiCategories && apiCategories.length > 0) {
            const mappedCategories: MegaItem[] = apiCategories.map((c: ApiCategory) => ({
              id: `nav-cat-${c.id}-${c.slug}`,
              icon: (c.icon_name && ICON_MAP[c.icon_name]) || Store,
              title: c.name || c.title || 'Category',
              subtitle: c.description
                ? (c.description.length > 36 ? c.description.slice(0, 36) + '…' : c.description)
                : 'Work sector',
              href: `/work/${c.slug}`,
              description: c.description || '',
            }))
            setCategories(mappedCategories)
          }
        }
      } catch (err) {
        console.warn('[Navbar] API data fetch failed, fallback static menus retained:', err)
      }
    }
    loadNavData()
    return () => {
      isMounted = false
    }
  }, [])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mega menu on route change
  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [pathname])

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(key)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || activeMenu
            ? 'bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/[0.07] shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        }`}
        id="main-navbar"
      >
        <div className="section-wrap">
          <div className="flex items-center h-16 md:h-[68px]">

            {/* Logo */}
            <Link href="/" id="nav-logo" className="flex items-center flex-shrink-0 group">
              <Image
                src="/urbanix-logo.png"
                alt="Urbanix Solution Logo"
                width={150}
                height={40}
                className="h-9 w-auto object-contain transition-all duration-200 group-hover:brightness-110"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 mx-auto" aria-label="Main navigation">
              {TOP_NAV.map(({ label, href, hasMega, megaKey }) => (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={() => hasMega && megaKey && openMenu(megaKey)}
                  onMouseLeave={() => hasMega && scheduleClose()}
                >
                  {hasMega ? (
                    <button
                      type="button"
                      id={`nav-link-${label.toLowerCase()}`}
                      onClick={() => megaKey && (activeMenu === megaKey ? setActiveMenu(null) : openMenu(megaKey))}
                      className={`nav-link cursor-pointer flex items-center gap-1 bg-transparent border-0 font-medium outline-none ${activeMenu === megaKey ? 'nav-link-active' : ''
                        }`}
                    >
                      <span>{label}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${activeMenu === megaKey ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={href}
                      id={`nav-link-${label.toLowerCase()}`}
                      className={`nav-link ${isActive(href) ? 'nav-link-active' : ''}`}
                    >
                      <span>{label}</span>
                    </Link>
                  )}
                  {!hasMega && isActive(href) && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 inset-x-3 h-[2px] rounded-full bg-[#3d5a99]"
                    />
                  )}
                  {/* Dynamic Dropdown Panel */}
                  <AnimatePresence>
                    {hasMega && activeMenu === megaKey && (
                      <DropdownPanel
                        items={megaKey === 'services' ? services : categories}
                        onClose={() => setActiveMenu(null)}
                        label={label}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <Link
                href="/contact"
                id="nav-cta"
                className="btn-solid text-sm font-medium px-5 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 tracking-wide"
              >
                Book a Consultation
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              id="nav-mobile-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-auto md:hidden p-2 rounded-lg text-[#8892a4]
                         hover:text-white hover:bg-[#111827] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-[rgba(255,255,255,0.06)]
                         bg-[#0b0f19]/98 backdrop-blur-xl"
            >
              <div className="section-wrap py-4 space-y-1">
                {TOP_NAV.map(({ label, href, hasMega, megaKey }) => (
                  <div key={href}>
                    {hasMega ? (
                      <>
                        <button
                          id={`mobile-nav-${label.toLowerCase()}`}
                          onClick={() => setMobileExpanded(mobileExpanded === megaKey ? null : (megaKey ?? null))}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg
                                     text-[13px] font-medium transition-colors duration-150
                                     ${isActive(href)
                              ? 'text-white bg-[rgba(61,90,153,0.12)]'
                              : 'text-[#8892a4] hover:text-white hover:bg-[#111827]'
                            }`}
                        >
                          {label}
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${mobileExpanded === megaKey ? 'rotate-180' : ''
                              }`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileExpanded === megaKey && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              <div className="px-2 pb-1 pt-1 space-y-0.5">
                                {(megaKey === 'services' ? services : categories).map(
                                  ({ id, icon: Icon, title, subtitle, href: itemHref }) => (
                                    <Link
                                      key={id}
                                      href={itemHref}
                                      id={`mobile-${id}`}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                 text-[12px] text-[#8892a4] hover:text-white
                                                 hover:bg-[#111827] transition-colors duration-150 group"
                                    >
                                      <div className="w-6 h-6 rounded-md flex items-center justify-center
                                                      bg-[rgba(61,90,153,0.12)] border border-[rgba(61,90,153,0.15)]
                                                      flex-shrink-0">
                                        <Icon size={12} className="text-[#9ab0d8]" />
                                      </div>
                                      <span className="font-medium">{title}</span>
                                      <span className="text-[10px] text-[#4a5568] ml-auto truncate max-w-[120px]">{subtitle}</span>
                                    </Link>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={href}
                        id={`mobile-nav-${label.toLowerCase()}`}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-2.5 rounded-lg text-[13px] font-medium
                                   transition-colors duration-150 ${isActive(href)
                            ? 'text-white bg-[rgba(61,90,153,0.12)]'
                            : 'text-[#8892a4] hover:text-white hover:bg-[#111827]'
                          }`}
                      >
                        {label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    id="mobile-nav-cta"
                    className="btn-solid w-full justify-center text-[13px] py-3"
                  >
                    Book a Consultation <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 hidden md:block"
            style={{ top: 68 }}
            onClick={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
