'use client'

const SERVICES = [
  'Web Development',
  'Local SEO',
  'Lead Generation',
  'Branding',
  'Analytics',
  'Google Ads',
  'Meta Ads',
  'Social Media Management',
  'Performance Marketing',
]

// Duplicate array multiple times for a seamless, continuous marquee loop
const ALL_SERVICES = [...SERVICES, ...SERVICES, ...SERVICES, ...SERVICES]

export default function LogoTicker() {
  return (
    <section
      id="service-ticker"
      className="bg-[#0b0f19] border-y border-[rgba(255,255,255,0.06)] overflow-hidden py-3 sm:py-3.5 relative"
    >
      {/* Edge Fade Masks for smooth gradient transition */}
      <div
        className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #0b0f19 0%, transparent 100%)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #0b0f19 0%, transparent 100%)' }}
      />

      <div className="w-full overflow-hidden select-none">
        <div className="ticker-track flex items-center">
          {ALL_SERVICES.map((service, index) => (
            <div
              key={`${service}-${index}`}
              className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4 flex-shrink-0"
            >
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                {service}
              </span>
              {/* Cyan Accent Separator Dot */}
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00c4cc] shadow-[0_0_8px_rgba(0,196,204,0.6)] flex-shrink-0"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
