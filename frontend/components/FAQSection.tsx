'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Why should I choose your agency over big marketing companies?',
    answer:
      'Big agencies treat local businesses as small accounts and charge heavy fees for presentations and complicated reports. We are completely different. We are a dedicated local growth team that speaks your language. We focus only on what matters to your shop or service: bringing in more footfall, generating direct WhatsApp leads, and growing your daily sales without wasting money.',
  },
  {
    question: 'My business is entirely offline and very small. Can you still help?',
    answer:
      'Absolutely! We love helping offline businesses take their first digital step. Whether you own a salon, a car wash, or a retail shop, we build your online presence from scratch. We handle everything—from setting up your Google Maps profile to building a fast website and running your first local ads.',
  },
  {
    question: 'How much does it cost to start?',
    answer:
      'Our pricing is built for local business budgets. We don\'t believe in forcing expensive, long-term contracts on you. We offer flexible plans depending on what you need—whether it\'s just a simple website, monthly Reels editing, or a full lead-generation ad campaign. We keep our pricing 100% transparent with no hidden fees.',
  },
  {
    question: 'How fast will I see results and get new customers?',
    answer:
      'If we are running Performance Ads (Google or Facebook) for you, you can start seeing local leads within 24 to 48 hours of launch. For long-term strategies like Local SEO (ranking higher on Google Maps) and website traffic, it usually takes a few weeks to build strong momentum. We recommend a mix of both for instant sales and long-term growth.',
  },
  {
    question: 'Do you only make websites, or do you handle social media too?',
    answer:
      'We provide 360° Digital Growth. Building a fast, premium website is just the foundation. Once it\'s live, we help you edit viral Instagram Reels, design offers, and run targeted ads to ensure people actually visit your website and your physical store.',
  },
  {
    question: 'How will I know if the marketing is actually working?',
    answer:
      'We don\'t confuse you with complicated tech reports. We measure success by real business metrics: How many people clicked your WhatsApp button? How many calls did you receive? How much did your daily footfall increase? You will see the results directly on your phone and at your cash counter.',
  },
  {
    question: 'How do we get started?',
    answer:
      'It’s incredibly easy. Just click the "Get a FREE Digital Growth Audit" button on our website to send us a direct WhatsApp message. We will review your current online presence for free and discuss a growth plan. No pressure, no hidden charges.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // Default open 1st item
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917631428236'
  const waMessage = encodeURIComponent(
    'Hi! I have a question before starting my FREE Digital Growth Audit.'
  )
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="section-py bg-[#0b0f19] border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00c4cc]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-wrap relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(0,196,204,0.12)] text-[#00c4cc] border border-[rgba(0,196,204,0.25)] mb-4">
            <HelpCircle size={14} className="text-[#00c4cc]" />
            Got Questions? We've Got Answers
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl text-white mb-3">
            Everything You Need to Know Before We Start
          </h2>
          <p className="text-sm sm:text-base text-[#8892a4] max-w-xl mx-auto leading-relaxed">
            Clear, transparent answers for local business owners. No tech jargon.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                id={`faq-item-${index + 1}`}
                className={`card-dark rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isOpen
                    ? 'border-[rgba(0,196,204,0.35)] bg-gradient-to-b from-[#111827] to-[#0d1424] shadow-[0_8px_30px_rgba(0,196,204,0.08)]'
                    : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] bg-[#0d1120]'
                }`}
              >
                {/* Question Accordion Button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  id={`faq-button-${index + 1}`}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 outline-none group cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-semibold text-white group-hover:text-[#00c4cc] transition-colors leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[rgba(0,196,204,0.15)] border-[rgba(0,196,204,0.3)] text-[#00c4cc] rotate-180'
                        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[#8892a4] group-hover:text-white'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Collapsible Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[#9ab0d8] leading-relaxed border-t border-[rgba(255,255,255,0.04)]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Quick WhatsApp CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 rounded-2xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Have a question not listed here?
            </h4>
            <p className="text-xs text-[#8892a4]">
              Chat directly with our lead growth strategist on WhatsApp. No pushy sales pitch.
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="faq-whatsapp-btn"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold shadow-[0_4px_15px_rgba(16,185,129,0.3)] inline-flex items-center gap-2 transition-all duration-200"
          >
            <MessageCircle size={15} />
            Ask Us on WhatsApp
            <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
