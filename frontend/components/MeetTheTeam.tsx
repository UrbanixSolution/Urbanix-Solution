'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, ShieldCheck, Cpu, LineChart, Linkedin, Github, Sparkles } from 'lucide-react'

const TEAM_MEMBERS = [
  {
    name: 'Rahul Sharma',
    role: 'Lead Full-Stack Architect',
    focus: 'Core Engineering & Architecture',
    bio: 'Obsessed with sub-second page performance, clean Django & Next.js code, and scalable cloud systems.',
    skills: ['Next.js', 'Django REST', 'System Design', 'PostgreSQL'],
    icon: Code2,
    gradient: 'from-[#00c4cc] to-[#3d5a99]',
    initials: 'RS',
  },
  {
    name: 'Ananya Verma',
    role: 'Senior UI/UX & Frontend Designer',
    focus: 'User Experience & Design System',
    bio: 'Crafting pixel-perfect visual identities and intuitive interfaces that delight users and drive conversion.',
    skills: ['Framer Motion', 'Tailwind CSS', 'Figma', 'UX Strategy'],
    icon: Sparkles,
    gradient: 'from-[#ec4899] to-[#8b5cf6]',
    initials: 'AV',
  },
  {
    name: 'Vikram Patel',
    role: 'Backend & Cloud Specialist',
    focus: 'APIs & Infrastructure',
    bio: 'Architecting rock-solid backend microservices, database optimizations, and CI/CD deployment pipelines.',
    skills: ['Python', 'Docker', 'AWS', 'WebSockets'],
    icon: Cpu,
    gradient: 'from-[#3b82f6] to-[#1d4ed8]',
    initials: 'VP',
  },
  {
    name: 'Sneha Rao',
    role: 'Digital Growth & SEO Strategist',
    focus: 'Conversion Rate & SEO',
    bio: 'Connecting technical excellence with local search dominance, WhatsApp funnel automation, and ROI growth.',
    skills: ['Local SEO', 'WhatsApp Funnels', 'Analytics', 'CRO'],
    icon: LineChart,
    gradient: 'from-[#10b981] to-[#059669]',
    initials: 'SR',
  },
]

export default function MeetTheTeam() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="meet-the-team"
      className="section-py bg-[#0b0f19] border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden"
    >
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#3d5a99]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-wrap relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(61,90,153,0.15)] text-[#9ab0d8] border border-[rgba(61,90,153,0.3)] mb-4">
            <ShieldCheck size={14} className="text-[#00c4cc]" />
            100% In-House Expertise
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl text-white mb-3">
            Meet the Team
          </h2>
          <p className="text-sm sm:text-base text-[#8892a4] font-medium max-w-xl mx-auto leading-relaxed">
            No outsourced work. Meet the dedicated team behind your digital growth.
          </p>
        </motion.div>

        {/* Team Grid (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, i) => {
            const Icon = member.icon
            return (
              <motion.div
                key={member.name}
                id={`team-member-${i + 1}`}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="card-dark group p-6 flex flex-col justify-between border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,196,204,0.3)] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div>
                  {/* Avatar / Initials Badge */}
                  <div className="relative mb-5 flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#0d1120] rounded-[14px] flex items-center justify-center font-serif text-lg font-bold text-white tracking-wider">
                        {member.initials}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#9ab0d8]">
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#00c4cc] transition-colors duration-200">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#00c4cc] mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#8892a4] leading-relaxed mb-5">
                    {member.bio}
                  </p>
                </div>

                <div>
                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-medium text-[#8892a4] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
