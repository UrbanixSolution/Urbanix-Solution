import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Palette,
  Sparkles,
  Globe,
  ShoppingCart,
  Layers,
  Cpu,
  MapPin,
  Target,
  Share2,
  MessageSquare,
  ShieldCheck,
  Bot,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services & Pricing — Urbanix Solution | Complete Digital Agency Solutions',
  description:
    'Explore Urbanix Solution’s full suite of high-impact digital services: Web Development, E-Commerce, UI/UX Design, Local SEO, Performance Ads, AI Chatbots, and Maintenance with transparent pricing.',
}

type ServiceItem = {
  id: string
  title: string
  subtitle: string
  description: string
  startingPrice: string
  href: string
  features: string[]
  icon: React.ElementType
  popular?: boolean
  badge?: string
}

type CategorySection = {
  category: string
  tagline: string
  color: string
  badgeBg: string
  badgeText: string
  items: ServiceItem[]
}

const CATEGORIES: CategorySection[] = [
  {
    category: 'Design & Branding',
    tagline: 'Crafting unforgettable brand identities & user-centric digital experiences.',
    color: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-400',
    items: [
      {
        id: 'ui-ux-design',
        title: 'UI/UX Design',
        subtitle: 'Figma prototyping & user journeys',
        description: 'Pixel-perfect UI design systems, wireframes, and conversion-focused user experiences tailored to your audience.',
        startingPrice: 'Starts at ₹1,499',
        href: '/services/ui-ux-design',
        features: ['Figma Design Systems', 'Interactive Prototypes', 'User Journey Mapping', 'Mobile-First Layouts'],
        icon: Palette,
        popular: true,
      },
      {
        id: 'brand-identity',
        title: 'Brand Identity & Logo',
        subtitle: 'Visual assets & guidelines',
        description: 'Complete brand kits including logo design, color palettes, typography specs, and social media assets.',
        startingPrice: 'Starts at ₹499',
        href: '/services/brand-identity',
        features: ['Custom Logo Design', 'Brand Style Guide', 'Typography & Palette', 'Social Media Templates'],
        icon: Sparkles,
      },
    ],
  },
  {
    category: 'Development & Tech',
    tagline: 'Building ultra-fast websites, custom web apps, and secure backend systems.',
    color: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-[#00c4cc]',
    items: [
      {
        id: 'business-websites',
        title: 'Business Websites',
        subtitle: 'High-converting landing pages',
        description: 'Custom landing pages and business websites built for maximum conversions, SEO performance, and sub-1s load times.',
        startingPrice: 'Starts at ₹2,999',
        href: '/services/business-websites',
        features: ['Sub-1s Page Load Speed', 'WhatsApp Lead Buttons', 'Google Maps & Local SEO', '100% Mobile Responsive'],
        icon: Globe,
        popular: true,
      },
      {
        id: 'e-commerce-setup',
        title: 'E-Commerce Setup',
        subtitle: 'Online stores & payment gateways',
        description: 'Turnkey digital storefronts with secure payment integrations, inventory sync, and automated receipt workflows.',
        startingPrice: 'Starts at ₹9,999',
        href: '/services/e-commerce',
        features: ['Razorpay / Stripe Payments', 'Catalog & Order Dashboard', 'WhatsApp Receipts', 'One-Page Checkout'],
        icon: ShoppingCart,
      },
      {
        id: 'custom-web-applications',
        title: 'Custom Web Applications',
        subtitle: 'Dashboards & SaaS platforms',
        description: 'Scalable web apps, admin dashboards, and custom SaaS platforms built with Next.js and Django REST framework.',
        startingPrice: 'Starts at ₹14,999',
        href: '/services/custom-web-apps',
        features: ['Next.js & Django Stack', 'Role-Based Auth & Admin', 'Multi-tenant Support', 'RESTful API Architecture'],
        icon: Layers,
        badge: 'High-Ticket',
      },
      {
        id: 'api-integrations',
        title: 'API Integrations',
        subtitle: 'Third-party tools & database sync',
        description: 'Seamless integration of CRM, payment gateways, analytics tools, webhooks, and third-party API services.',
        startingPrice: 'Starts at ₹3,999',
        href: '/services/api-integrations',
        features: ['Payment & CRM Webhooks', 'Database Migration & Sync', 'Custom Microservices', 'Secure Auth Handshakes'],
        icon: Cpu,
      },
    ],
  },
  {
    category: 'Marketing & Growth',
    tagline: 'Driving targeted local traffic, paid campaign ROI, and social engagement.',
    color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    items: [
      {
        id: 'local-seo',
        title: 'Local SEO',
        subtitle: 'Google My Business ranking',
        description: 'Dominate local searches, Google Maps pack, and drive high-intent foot traffic and calls to your local business.',
        startingPrice: 'Starts at ₹1,999/mo',
        href: '/services/local-seo',
        features: ['GMB Profile Optimization', 'Local Citation Building', 'On-Page SEO Audit', 'Review Growth Funnel'],
        icon: MapPin,
        popular: true,
      },
      {
        id: 'performance-ads',
        title: 'Performance Ads',
        subtitle: 'Google & Meta ad campaigns',
        description: 'Data-driven paid ad campaigns on Meta and Google designed to maximize ROAS and customer acquisition.',
        startingPrice: 'Starts at ₹5,000/mo',
        href: '/services/performance-ads',
        features: ['Hyper-Local Targeting', 'High-Converting Ad Copy', 'WhatsApp Lead Ads', 'Weekly ROI Dashboards'],
        icon: Target,
      },
      {
        id: 'social-media-management',
        title: 'Social Media Management',
        subtitle: 'Reels, posts & content strategy',
        description: 'End-to-end social media content creation, Reels editing, post scheduling, and brand presence growth.',
        startingPrice: 'Starts at ₹999/mo',
        href: '/services/video-editing',
        features: ['HD Vertical Reels (9:16)', 'Trending Audio & Captions', 'Weekly Content Calendar', 'Audience Growth Strategy'],
        icon: Share2,
      },
      {
        id: 'whatsapp-marketing',
        title: 'WhatsApp Marketing',
        subtitle: 'Automated broadcast & lead funnels',
        description: 'Direct customer engagement via automated WhatsApp broadcasts, instant lead response buttons, and CRM sync.',
        startingPrice: 'Starts at ₹1,499/mo',
        href: '/services/whatsapp-marketing',
        features: ['Instant Lead Responses', 'Automated Campaign Broadcasts', 'Click-to-WhatsApp Ads', 'Custom Chat Triggers'],
        icon: MessageSquare,
      },
    ],
  },
  {
    category: 'Support & Solutions',
    tagline: 'Maintaining 99.9% uptime, security hardening, and AI automation.',
    color: 'from-amber-500/20 via-orange-500/10 to-transparent',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
    items: [
      {
        id: 'maintenance-support',
        title: 'Maintenance & Support',
        subtitle: '24/7 monitoring & technical retainers',
        description: 'Ongoing technical updates, security monitoring, daily backups, performance tuning, and priority support.',
        startingPrice: 'Starts at ₹4,999/mo',
        href: '/services/maintenance',
        features: ['24/7 Server Health Check', 'Daily Cloud Backups', 'Malware & SSL Scans', 'Priority WhatsApp Support'],
        icon: ShieldCheck,
      },
      {
        id: 'ai-chatbots',
        title: 'AI Chatbots',
        subtitle: 'Automated customer support & LLM bots',
        description: 'Intelligent AI-powered chatbots trained on your business data to handle FAQs, qualify leads, and book appointments 24/7.',
        startingPrice: 'Starts at ₹7,999',
        href: '/services/ai-chatbots',
        features: ['Custom Business Data RAG', '24/7 Automated Responses', 'Lead Qualification Logic', 'Seamless Human Handoff'],
        icon: Bot,
        badge: 'AI Powered',
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white pt-24 pb-20">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#3d5a99]/15 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="section-wrap text-center py-12 md:py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-[#00c4cc] mb-6">
          <Zap size={14} className="text-[#00c4cc]" />
          <span>Full-Spectrum Services & Transparent Pricing</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Crafting <span className="bg-gradient-to-r from-white via-slate-200 to-[#00c4cc] bg-clip-text text-transparent">Digital Excellence</span> for Your Business
        </h1>

        <p className="text-base sm:text-lg text-[#8892a4] max-w-2xl mx-auto leading-relaxed mb-8">
          From high-converting websites and custom SaaS applications to hyper-targeted performance marketing and AI automation — upfront pricing with zero hidden fees.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="btn-solid py-3 px-6 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#3d5a99]/20"
          >
            <span>Get a Custom Quote</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="#all-services"
            className="py-3 px-6 text-sm font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white transition-all"
          >
            Explore All Categories
          </a>
        </div>
      </section>

      {/* Categorized Services Grid */}
      <section id="all-services" className="section-wrap space-y-16 py-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.category} className="space-y-6">
            {/* Category Header */}
            <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{cat.category}</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#8892a4] max-w-md">{cat.tagline}</p>
            </div>

            {/* Grid layout matching grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cat.items.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.id}
                    className="relative group bg-[#0e1424]/90 border border-white/[0.08] hover:border-[#00c4cc]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_12px_35px_rgba(0,196,204,0.08)] hover:-translate-y-1"
                  >
                    <div>
                      {/* Badge / Popular Indicator */}
                      {item.popular && (
                        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00c4cc]/15 border border-[#00c4cc]/40 text-[#00c4cc]">
                          Popular
                        </span>
                      )}
                      {item.badge && !item.popular && (
                        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300">
                          {item.badge}
                        </span>
                      )}

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#00c4cc] group-hover:bg-[#00c4cc]/10 group-hover:border-[#00c4cc]/30 transition-colors mb-5">
                        <Icon size={24} />
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-lg font-bold text-white group-hover:text-[#00c4cc] transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-[#00c4cc]/80 mb-3">{item.subtitle}</p>

                      {/* Description */}
                      <p className="text-xs text-[#8892a4] leading-relaxed mb-5">{item.description}</p>

                      {/* Feature Checklist */}
                      <ul className="space-y-2 mb-4 border-t border-white/[0.05] pt-4">
                        {item.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[11px] text-slate-300">
                            <CheckCircle2 size={13} className="text-[#00c4cc] flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Price & Action Footer */}
                    <div className="border-t border-white/[0.06] pt-4 mt-2 flex flex-col gap-3">
                      {/* Starting Price Badge */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8892a4] font-medium">Starting Price</span>
                        <span className="font-bold text-[#00c4cc] bg-[#00c4cc]/10 border border-[#00c4cc]/20 px-2.5 py-1 rounded-md text-[11px]">
                          {item.startingPrice}
                        </span>
                      </div>

                      {/* Action Link */}
                      <Link
                        href={item.href}
                        className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] group-hover:bg-[#00c4cc]/15 border border-white/10 group-hover:border-[#00c4cc]/30 text-xs font-semibold text-white group-hover:text-[#00c4cc] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>View Details & Packages</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Conversion CTA */}
      <section className="section-wrap mt-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0b0f19] via-[#111a2e] to-[#0b0f19] border border-white/10 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[#00c4cc]/5 pointer-events-none blur-2xl" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Accelerate Your Digital Growth?
          </h2>
          <p className="text-sm sm:text-base text-[#8892a4] max-w-xl mx-auto mb-8">
            Tell us about your project requirements or select a service package. Our team delivers custom solutions within tight timelines.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-solid py-3 px-8 text-sm font-semibold rounded-xl">
              Start Your Project Today →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
