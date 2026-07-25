import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CheckCircle2, ArrowRight, Globe, ShoppingCart, Video, Target,
  MapPin, ShieldCheck, MessageCircle, Sparkles, Zap, Clock, Star,
  Palette, Layers, Cpu, Bot, MessageSquare
} from 'lucide-react'
import { fetchServiceBySlug, type ApiService, type ApiPricingTier } from '@/lib/api'

// ─────────────────────────────────────────────────────────────
// Lucide Icon Mapping
// ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  ShoppingCart,
  Video,
  Target,
  MapPin,
  ShieldCheck,
  Palette,
  Layers,
  Cpu,
  Bot,
  Sparkles,
  MessageSquare,
  Layout: Globe,
  Film: Video,
  Search: MapPin,
  Wrench: ShieldCheck,
}

// ─────────────────────────────────────────────────────────────
// Fallback Service Catalog (Guarantees zero 404 for all 12 services)
// ─────────────────────────────────────────────────────────────

const FALLBACK_SERVICES: Record<string, ApiService> = {
  'business-websites': {
    id: 101,
    title: 'Business Websites',
    slug: 'business-websites',
    short_description: 'High-converting landing pages and custom business websites built for maximum conversions.',
    full_description: 'We build lightning-fast, custom websites tailored specifically for growing businesses. Every layout is engineered to turn casual visitors into paying customers with clear calls-to-action, instant WhatsApp integration, and mobile optimization.',
    pricing_text: 'Starts at ₹2,999',
    features: ['100% Mobile & Desktop Responsive', 'WhatsApp & Lead Buttons', 'Google Maps & Business Setup', 'Sub-1s Speed Optimization', 'On-Page Local SEO', 'Free SSL & Security'],
    pricing_tiers: [
      { id: 1, name: 'Single-Page', price: '₹2,999', delivery_time: 'Delivered in 3-5 Days', features: ['1 High-Converting Page', 'Mobile & Desktop Responsive', 'WhatsApp Chat Button', 'Basic SEO Setup'], is_popular: false },
      { id: 2, name: 'Standard Business Website', price: '₹5,999', delivery_time: 'Delivered in 4-5 Days', features: ['3-5 Custom Pages', 'Dynamic Admin CMS Panel', 'On-Page SEO', 'Google Business Setup'], is_popular: true },
      { id: 3, name: 'Lead-Gen Landing Page', price: '₹8,999', delivery_time: 'Delivered in 4-5 Days', features: ['High-Converting Copy', 'Lead Form + WhatsApp Alert', 'Sub-1s Page Load Speed', 'A/B Test Ready'], is_popular: false }
    ],
    icon_name: 'Globe'
  },
  'e-commerce': {
    id: 102,
    title: 'E-Commerce Setup',
    slug: 'e-commerce',
    short_description: 'Turnkey digital storefronts with secure payment integrations and inventory sync.',
    full_description: 'Launch your online store with zero hassle. Complete catalog setup, Razorpay/Stripe payment gateway integrations, automated WhatsApp order receipts, and real-time inventory management.',
    pricing_text: 'Starts at ₹9,999',
    features: ['Razorpay / Stripe Gateway', 'WhatsApp Order Receipt Alerts', 'Product Inventory Dashboard', 'Discount Coupon Engine', 'High-Converting Checkout'],
    pricing_tiers: [
      { id: 4, name: 'Starter Online Store', price: '₹9,999', delivery_time: 'Delivered in 5-10 Days', features: ['Up to 20 Product Listings', 'UPI / Razorpay Gateway', 'Order Notification via WhatsApp', 'Mobile Friendly Storefront'], is_popular: false },
      { id: 5, name: 'Full E-Commerce Platform', price: '₹24,999', delivery_time: 'Delivered in 10-15 Days', features: ['Unlimited Products & Categories', 'Inventory Dashboard', 'Coupon Engine', 'Automated Invoice Generation'], is_popular: true }
    ],
    icon_name: 'ShoppingCart'
  },
  'ui-ux-design': {
    id: 103,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    short_description: 'Figma-to-code pixel-perfect interfaces that convert visitors into customers.',
    full_description: 'Modern Figma design systems, interactive prototypes, user journey mapping, and conversion-optimized mobile and desktop interfaces.',
    pricing_text: 'Starts at ₹1,499',
    features: ['Figma Component Library', 'Interactive Prototypes', 'User Journey Mapping', 'Mobile & Desktop Screens', 'Design System Tokens'],
    pricing_tiers: [
      { id: 6, name: 'Basic Wireframe & UI', price: '₹1,499', delivery_time: 'Delivered in 2-3 Days', features: ['Home Page UI Design', 'Figma Source File', 'Mobile Responsive Spec', '2 Revision Rounds'], is_popular: false },
      { id: 7, name: 'Full UI/UX Design System', price: '₹4,999', delivery_time: 'Delivered in 5-7 Days', features: ['Multi-page Figma Specs', 'Design Tokens & Components', 'Interactive Prototype', 'Unlimited Revisions'], is_popular: true }
    ],
    icon_name: 'Palette'
  },
  'brand-identity': {
    id: 104,
    title: 'Brand Identity & Logo',
    slug: 'brand-identity',
    short_description: 'Complete brand kits including logo design, color palettes, and visual guidelines.',
    full_description: 'Give your business a distinct visual identity. We craft vector logos, cohesive color palettes, typography specs, business cards, and social media brand assets.',
    pricing_text: 'Starts at ₹499',
    features: ['Custom Vector Logo', 'Brand Style Guide PDF', 'Typography & Color Palette', 'Social Media Branding Kit', 'Source Vector Files (SVG, AI)'],
    pricing_tiers: [
      { id: 8, name: 'Essential Logo Package', price: '₹499', delivery_time: 'Delivered in 24-48 Hours', features: ['2 Logo Concepts', 'PNG/JPEG Export', 'Basic Color Palette', '1 Revision Round'], is_popular: false },
      { id: 9, name: 'Complete Brand Identity Kit', price: '₹1,999', delivery_time: 'Delivered in 3-5 Days', features: ['5 Logo Concepts', 'Full Brand Guidelines PDF', 'Social Media Templates', 'Vector AI/SVG Files', 'Business Card Design'], is_popular: true }
    ],
    icon_name: 'Sparkles'
  },
  'custom-web-apps': {
    id: 105,
    title: 'Custom Web Applications',
    slug: 'custom-web-apps',
    short_description: 'Scalable web apps, admin dashboards, and custom SaaS platforms built with Next.js and Django.',
    full_description: 'Full-stack web application development for complex business requirements. Multi-tenant SaaS architecture, role-based access control, real-time dashboards, and secure REST APIs.',
    pricing_text: 'Starts at ₹14,999',
    features: ['Next.js & Django REST Architecture', 'Role-Based Authentication', 'Custom Admin CMS', 'PostgreSQL Database Integration', 'CI/CD & Cloud Deployment'],
    pricing_tiers: [
      { id: 10, name: 'SaaS MVP Launch', price: '₹14,999', delivery_time: 'Delivered in 2-3 Weeks', features: ['Core Feature MVP', 'Auth & Admin Panel', 'Database Architecture', 'Cloud Deployment'], is_popular: true },
      { id: 11, name: 'Enterprise Web Platform', price: '₹34,999', delivery_time: 'Delivered in 4-6 Weeks', features: ['Multi-tenancy & Billing', 'Custom API Integrations', 'Real-time Dashboards', 'SLA Uptime Support'], is_popular: false }
    ],
    icon_name: 'Layers'
  },
  'api-integrations': {
    id: 106,
    title: 'API Integrations',
    slug: 'api-integrations',
    short_description: 'Third-party tool sync, CRM webhooks, payment gateways, and microservices.',
    full_description: 'Seamlessly connect your existing web stack with external APIs, payment gateways (Razorpay, Stripe, PayPal), CRMs (HubSpot, Zoho), and automated notification webhooks.',
    pricing_text: 'Starts at ₹3,999',
    features: ['Payment Gateway Webhooks', 'CRM & Lead Automation', 'Third-Party REST API Integration', 'Data Transformation & Sync', 'Secure SSL Authentication'],
    pricing_tiers: [
      { id: 12, name: 'Single API Integration', price: '₹3,999', delivery_time: 'Delivered in 2-4 Days', features: ['1 API / Gateway Setup', 'Webhook Handler', 'Testing & Error Handling', '1 Month Support'], is_popular: true }
    ],
    icon_name: 'Cpu'
  },
  'local-seo': {
    id: 107,
    title: 'Local SEO',
    slug: 'local-seo',
    short_description: 'Dominate local searches, Google Maps pack, and drive foot traffic to your business.',
    full_description: 'Hyper-local search engine optimization engineered to get your business into the top 3 Google Maps pack. Local citation building, GMB profile optimization, and review management funnels.',
    pricing_text: 'Starts at ₹1,999/mo',
    features: ['Google My Business Optimization', 'Local Citation & NAP Audit', 'On-Page Local SEO', 'Customer Review Growth Funnel', 'Monthly Ranking Reports'],
    pricing_tiers: [
      { id: 13, name: 'GMB Starter Optimization', price: '₹1,999/mo', delivery_time: 'Monthly Managed', features: ['GMB Profile Setup & Verification', 'Geo-tagged Photo Uploads', 'Local Keywords & Categories', 'Monthly Performance Report'], is_popular: false },
      { id: 14, name: 'Pro Local SEO Accelerator', price: '₹4,999/mo', delivery_time: 'Monthly Managed', features: ['Top 3 Map Pack Optimization', '50+ Local Directory Citations', 'Competitor Keyword Hijack', 'Review Growth Automation'], is_popular: true }
    ],
    icon_name: 'MapPin'
  },
  'performance-ads': {
    id: 108,
    title: 'Performance Ads',
    slug: 'performance-ads',
    short_description: 'Data-driven paid ad campaigns designed to maximize ROI and customer acquisition.',
    full_description: 'Target high-intent customers in your city or region. We manage Google Search & Display Ads, Meta (Facebook & Instagram) Lead Ads, and retargeting funnels.',
    pricing_text: 'Starts at ₹5,000/mo',
    features: ['Google & Meta Ads Setup', 'Hyper-Local Geo Targeting', 'High-Converting Ad Copy & Creatives', 'Direct WhatsApp Lead Campaigns', 'Weekly ROI & ROAS Dashboards'],
    pricing_tiers: [
      { id: 15, name: 'Growth Campaign Management', price: '₹5,000/mo', delivery_time: 'Monthly Managed', features: ['Up to ₹50k Ad Spend Management', 'Google & Meta Campaign Setup', 'A/B Testing Creatives', 'Weekly Performance Reports'], is_popular: true }
    ],
    icon_name: 'Target'
  },
  'video-editing': {
    id: 109,
    title: 'Reels & Video Editing',
    slug: 'video-editing',
    short_description: 'High-impact short-form video reels, promotional edits, and brand stories.',
    full_description: 'Capture attention on Instagram Reels, YouTube Shorts, and TikTok. We edit high-engagement vertical videos with dynamic motion graphics, subtitles, sound design, and viral hooks.',
    pricing_text: 'Starts at ₹999/mo',
    features: ['1080p Vertical Edits (9:16)', 'Dynamic Subtitles & Motion FX', 'Trending Audio & Sound Design', 'Custom Cover Thumbnails', 'Fast 48-Hour Turnaround'],
    pricing_tiers: [
      { id: 16, name: 'Starter Reel Bundle (4 Edits)', price: '₹999/mo', delivery_time: 'Weekly Delivery', features: ['4 High-Quality Vertical Reels', 'Engaging Captions & Effects', 'Trending Music Overlay', '2 Revision Rounds'], is_popular: false },
      { id: 17, name: 'Pro Content Pack (12 Edits)', price: '₹2,999/mo', delivery_time: 'Monthly Managed', features: ['12 High-Impact Edits', 'Custom Thumbnails', 'Hook Scripting Guidance', 'Fast 24-48h Turnaround'], is_popular: true }
    ],
    icon_name: 'Video'
  },
  'whatsapp-marketing': {
    id: 110,
    title: 'WhatsApp Marketing',
    slug: 'whatsapp-marketing',
    short_description: 'Direct customer engagement via automated broadcasts and instant response buttons.',
    full_description: 'Reach your customers where they read 98% of messages. Click-to-WhatsApp ad funnels, automated broadcast campaigns, interactive quick-reply buttons, and CRM integration.',
    pricing_text: 'Starts at ₹1,499/mo',
    features: ['Click-to-WhatsApp Setup', 'Automated Greeting & FAQ Bot', 'Broadcast Campaign Engine', 'Customer Segment Management', 'Performance Analytics'],
    pricing_tiers: [
      { id: 18, name: 'WhatsApp Business Automator', price: '₹1,499/mo', delivery_time: 'Monthly Managed', features: ['Auto-Reply Setup', 'Lead Capture Form Link', 'Monthly Broadcast Campaign', 'WhatsApp API Setup'], is_popular: true }
    ],
    icon_name: 'MessageSquare'
  },
  'maintenance': {
    id: 111,
    title: 'Maintenance & Support',
    slug: 'maintenance',
    short_description: 'Ongoing technical updates, security monitoring, performance tuning, and priority support.',
    full_description: 'Keep your digital infrastructure running 24/7 without technical headaches. Monthly retainer covers cloud hosting management, daily backups, framework security patches, and instant WhatsApp support.',
    pricing_text: 'Starts at ₹4,999/mo',
    features: ['24/7 Uptime & Server Monitoring', 'Daily Cloud Database Backups', 'Security Patching & Malware Scans', 'Content & Price Updates', 'Priority WhatsApp Support'],
    pricing_tiers: [
      { id: 19, name: 'Care Retainer', price: '₹4,999/mo', delivery_time: 'Monthly Retainer', features: ['Daily Backups', 'Security Scans', 'Minor Content Updates', 'Priority Support'], is_popular: true }
    ],
    icon_name: 'ShieldCheck'
  },
  'ai-chatbots': {
    id: 112,
    title: 'AI Chatbots & Bots',
    slug: 'ai-chatbots',
    short_description: 'Intelligent AI-powered chatbots trained on your business data to qualify leads and answer FAQs 24/7.',
    full_description: 'Automate customer support and sales conversion with LLM-powered custom AI bots. Trained on your business knowledgebase, products, and services for zero-latency customer assistance.',
    pricing_text: 'Starts at ₹7,999',
    features: ['Custom RAG Knowledgebase Training', '24/7 Instant FAQ Answers', 'Lead Qualification & Capture', 'Website Widget & WhatsApp Sync', 'Human Escalation Handshake'],
    pricing_tiers: [
      { id: 20, name: 'AI Support Assistant', price: '₹7,999', delivery_time: 'Delivered in 5-7 Days', features: ['Trained on your Website & Docs', '24/7 Website Widget Integration', 'Lead Capture to Email/WhatsApp', 'Monthly Maintenance Included'], is_popular: true }
    ],
    icon_name: 'Bot'
  }
}

// ─────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = (await fetchServiceBySlug(slug)) || FALLBACK_SERVICES[slug]
  if (!service) {
    return { title: 'Service Not Found — Urbanix Solution' }
  }
  return {
    title: `${service.title} — Urbanix Solution`,
    description: service.short_description || service.full_description || `Empowering local businesses with ${service.title}.`,
  }
}

// ─────────────────────────────────────────────────────────────
// Tiered Pricing Card
// ─────────────────────────────────────────────────────────────

function TierCard({ tier, serviceTitle, whatsappNumber }: {
  tier: ApiPricingTier
  serviceTitle: string
  whatsappNumber: string
}) {
  const waText = encodeURIComponent(
    `Hi Urbanix Solution, I want to book the ${tier.name} package for ${serviceTitle}.`
  )
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waText}`

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 ${
        tier.is_popular
          ? 'bg-gradient-to-b from-[#111827] to-[#0d1424] border-2 border-[rgba(0,196,204,0.5)] shadow-[0_0_35px_rgba(0,196,204,0.15)] scale-[1.02]'
          : 'bg-[#0f1623] border border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Most Popular Badge */}
      {tier.is_popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-bold bg-[#00c4cc] text-[#0b0f19] whitespace-nowrap shadow-[0_0_20px_rgba(0,196,204,0.4)]">
          <Star size={11} className="fill-current" />
          Most Popular
        </div>
      )}

      {/* Tier Name */}
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00c4cc]">{tier.name}</span>
      </div>

      {/* Price */}
      <div className="mb-1">
        <span className="text-[2.4rem] font-bold text-white font-serif leading-none">{tier.price}</span>
      </div>

      {/* Delivery Time */}
      {tier.delivery_time && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 pb-5 border-b border-slate-800/80">
          <Clock size={12} className="shrink-0 text-[#00c4cc]" />
          <span>{tier.delivery_time}</span>
        </div>
      )}
      {!tier.delivery_time && <div className="mb-5 pb-5 border-b border-slate-800/80" />}

      {/* Features */}
      {tier.features && tier.features.length > 0 && (
        <ul className="space-y-2.5 mb-7 flex-1">
          {tier.features.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-300">
              <CheckCircle2 size={15} className="text-[#10b981] shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Spacer to push button down when no features */}
      {(!tier.features || tier.features.length === 0) && <div className="flex-1" />}

      {/* WhatsApp Booking Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        id={`book-tier-${tier.id}`}
        className={`mt-auto w-full py-3 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${
          tier.is_popular
            ? 'bg-gradient-to-r from-[#00c4cc] to-[#009da3] hover:from-[#009da3] hover:to-[#008085] text-white shadow-[0_0_20px_rgba(0,196,204,0.3)]'
            : 'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/50'
        }`}
      >
        <MessageCircle size={16} className="shrink-0" />
        <span>Book This Package</span>
        <ArrowRight size={14} />
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = (await fetchServiceBySlug(slug)) || FALLBACK_SERVICES[slug]

  if (!service) {
    notFound()
  }

  const IconComponent = (service.icon_name && ICON_MAP[service.icon_name]) || Globe

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'
  const waText = encodeURIComponent(
    `Hi Urbanix Solution, I want to know more about the ${service.title} service.`
  )
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waText}`

  const featuresList = service.features && Array.isArray(service.features) && service.features.length > 0
    ? service.features
    : [
        'Dedicated Local Business Growth Specialist',
        'Direct WhatsApp Lead Integration & Instant Calls',
        'High-Converting Mobile & Desktop Layout',
        'Sub-1 Second Page Loading Optimization',
        'On-Page Local SEO Setup',
        'Post-Launch Technical Maintenance & Support',
      ]

  const hasTiers = service.pricing_tiers && service.pricing_tiers.length > 0

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-20">
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden border-b border-slate-800/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00c4cc]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="section-wrap relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#00c4cc]">{service.title}</span>
          </nav>

          {/* 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & Quick CTA */}
            <div>
              {/* Service Icon Badge */}
              <div className="w-16 h-16 rounded-2xl bg-[rgba(0,196,204,0.12)] border border-[rgba(0,196,204,0.3)] text-[#00c4cc] flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(0,196,204,0.15)]">
                <IconComponent size={32} />
              </div>

              <p className="label-caps mb-3 text-xs sm:text-sm text-[#00c4cc]">Service Offering</p>

              <h1 className="heading-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-[#94a3b8] max-w-xl leading-relaxed mb-8">
                {service.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid py-3 px-6 text-sm font-semibold rounded-xl flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>Inquire via WhatsApp</span>
                  <ArrowRight size={14} />
                </a>
                {service.pricing_text && (
                  <span className="text-xs font-semibold text-[#00c4cc] bg-[#00c4cc]/10 border border-[#00c4cc]/30 px-3.5 py-2.5 rounded-xl">
                    {service.pricing_text}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Glassmorphism Visual Anchor Cards */}
            <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
              {/* Animated Ambient Glow Blob */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#00c4cc]/20 via-[#3d5a99]/20 to-purple-500/20 blur-3xl animate-pulse pointer-events-none" />

              {/* Floating Glass Cards Container */}
              <div className="relative w-full max-w-md space-y-4">
                {/* Highlight Card 1 */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#00c4cc]/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00c4cc]/15 border border-[#00c4cc]/30 flex items-center justify-center text-[#00c4cc] flex-shrink-0">
                    <Zap size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">48-Hour Fast Delivery</h4>
                    <p className="text-xs text-[#8892a4]">Rapid execution & agile turnaround on all deliverables.</p>
                  </div>
                </div>

                {/* Highlight Card 2 (Staggered offset) */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#00c4cc]/40 transition-all duration-300 transform lg:translate-x-6 hover:translate-x-7 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Viral Hooks & Conversion Copy</h4>
                    <p className="text-xs text-[#8892a4]">Engineered to capture attention & maximize customer ROI.</p>
                  </div>
                </div>

                {/* Highlight Card 3 */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#00c4cc]/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Star size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Platform Optimized</h4>
                    <p className="text-xs text-[#8892a4]">Tailored for Web, Mobile, Instagram Reels & Ad Networks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────── */}
      <section className="section-py">
        <div className="section-wrap space-y-14">

          {/* Overview + Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left: Overview & Included Features */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-[#0f1623] p-8 rounded-3xl border border-slate-800 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-[#00c4cc]" />
                  Service Overview
                </h2>
                <p className="text-base text-[#94a3b8] leading-relaxed whitespace-pre-line">
                  {service.full_description || service.short_description || 'We deliver high-converting digital solutions tailored for your business growth.'}
                </p>
              </div>

              {/* Included Features */}
              <div className="bg-[#0f1623] p-8 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">
                  What's Included in This Service
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuresList.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80"
                    >
                      <CheckCircle2 size={18} className="text-[#10b981] shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-200 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Contact Card (when no tiers or as supplemental CTA) */}
            {!hasTiers && (
              <div className="sticky top-28 bg-gradient-to-b from-[#111827] to-[#0d1424] p-8 rounded-3xl border border-[rgba(0,196,204,0.3)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(0,196,204,0.12)] text-[#00c4cc] border border-[rgba(0,196,204,0.3)]">
                  <Zap size={14} /> Transparent Local Pricing
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pricing Highlight</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                    {service.pricing_text || 'Custom Quote'}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                  100% transparent pricing with zero hidden fees. Includes setup, design, and dedicated support.
                </p>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="book-service-whatsapp-btn"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-base font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle size={20} className="fill-white/20" />
                  <span>Book This Service</span>
                  <ArrowRight size={16} />
                </a>

                <div className="text-center pt-1">
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Or request a custom web quote →
                  </Link>
                </div>
              </div>
            )}

            {/* Right: Pricing summary pill (when tiers exist) */}
            {hasTiers && (
              <div className="sticky top-28 bg-[#0f1623] p-6 rounded-3xl border border-slate-800 space-y-4 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-[#00c4cc] mb-1">Pricing Starts From</div>
                <div className="text-3xl font-extrabold text-white font-serif">
                  {service.pricing_text || service.pricing_tiers![0].price}
                </div>
                <p className="text-xs text-slate-400">Multiple packages available below. Pick the one that fits your needs.</p>
                <a
                  href="#pricing-tiers"
                  className="w-full mt-2 py-3 px-5 rounded-xl bg-[rgba(0,196,204,0.1)] border border-[rgba(0,196,204,0.3)] text-[#00c4cc] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[rgba(0,196,204,0.18)] transition-all"
                >
                  See All Packages
                  <ArrowRight size={14} />
                </a>
              </div>
            )}
          </div>

          {/* ── Tiered Pricing Grid ─────────────────────────────── */}
          {hasTiers && (
            <div id="pricing-tiers">
              <div className="mb-8">
                <p className="label-caps mb-2 text-[#00c4cc]">Transparent Pricing</p>
                <h2 className="heading-serif text-3xl sm:text-4xl text-white">
                  Choose Your <span className="heading-serif-italic">Package</span>
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-xl">
                  No hidden fees. All packages include full support. WhatsApp us directly to confirm your booking.
                </p>
              </div>

              <div className={`grid gap-6 items-start ${
                service.pricing_tiers!.length === 1
                  ? 'grid-cols-1 max-w-sm'
                  : service.pricing_tiers!.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {service.pricing_tiers!.map((tier) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    serviceTitle={service.title}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </div>

              <p className="text-center text-[11px] text-slate-600 mt-8">
                All prices in INR · GST applicable · Custom enterprise quotes available on request
              </p>
            </div>
          )}

          {/* ── Bottom CTA ─────────────────────────────────────── */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0f1623] via-[#111827] to-[#0f1623] border border-slate-800/60 p-10 text-center space-y-4">
            <p className="label-caps text-[#00c4cc]">Still Have Questions?</p>
            <h3 className="text-2xl font-bold text-white">Let's talk about your project</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Every business is unique. Reach out for a free 15-minute strategy call and a no-obligation custom quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="bottom-whatsapp-cta"
                className="btn-solid"
              >
                <MessageCircle size={16} />
                WhatsApp Us Now
              </a>
              <Link href="/contact" className="btn-ghost">
                Fill Contact Form
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
