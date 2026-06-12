import React from 'react'
import { Bell, Radio, FolderOpen } from 'lucide-react'

const features = [
  {
    Icon: Bell,
    title: 'Life event awareness',
    body: 'When a family member is born, someone turns 60, or you change jobs — ENTITLE automatically re-scans and surfaces new entitlements you just became eligible for.',
    tag: 'Proactive',
    tagColor: 'bg-blue-50 text-blue-700',
    iconBg: 'bg-blue-50 text-accent',
  },
  {
    Icon: Radio,
    title: 'New scheme alerts',
    body: 'Government announces new schemes daily. ENTITLE monitors official gazettes, PIB, and state portals so you\'re notified within hours — not months — of a relevant new scheme.',
    tag: 'Real-time',
    tagColor: 'bg-surface-brand text-brand-dark',
    iconBg: 'bg-surface-brand text-brand',
  },
  {
    Icon: FolderOpen,
    title: 'Application tracking',
    body: 'Track every submitted application in one dashboard. ENTITLE follows up with departments, re-submits rejected applications with corrections, and escalates when needed.',
    tag: 'Autonomous',
    tagColor: 'bg-amber-50 text-amber-700',
    iconBg: 'bg-amber-50 text-amber-700',
  },
]

export default function AutonomousFeatures() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-4 bg-surface-brand px-3 py-1.5 rounded-full border border-brand/20">
            Autonomous features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
            Set it and forget it
          </h2>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            ENTITLE works in the background, so your benefits find you — not the other way around.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(feature => {
            const Icon = feature.Icon
            return (
              <div
                key={feature.title}
                className="bg-surface border border-border rounded-2xl p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${feature.tagColor}`}>
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
