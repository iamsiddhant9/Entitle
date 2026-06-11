import React from 'react'
import { MessageSquare, ScanLine, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Talk',
    body: 'Chat naturally with the ENTITLE agent. Tell us your age, occupation, location, and family details in your own words. No forms, no PDFs.',
    color: 'text-accent',
    bg: 'bg-blue-50',
    border: '',
  },
  {
    number: '02',
    icon: ScanLine,
    title: 'Scan',
    body: 'Our AI scans every central and state scheme — 1,200+ and counting. It cross-references your profile to find exact matches with confidence scores.',
    color: 'text-brand',
    bg: 'bg-surface-green',
    border: 'animate-borderPulse',
    badge: '1,200+ schemes checked',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Claim',
    body: 'ENTITLE autonomously drafts and submits applications, collects your documents via chat, and tracks status — so you get paid without chasing offices.',
    color: 'text-ink',
    bg: 'bg-surface',
    border: '',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-4 bg-surface-green px-3 py-1.5 rounded-full border border-brand/20">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
            Three steps to your money
          </h2>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            No appointments. No government offices. ENTITLE does the work end-to-end.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(step => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`relative bg-surface border border-border rounded-2xl p-8 ${step.border}`}
              >
                {/* Step number */}
                <div className="text-xs font-bold text-muted uppercase tracking-widest mb-6">
                  Step {step.number}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>

                {/* Badge for scan step */}
                {step.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-surface-green border border-brand/20 rounded-full px-3 py-1 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span className="text-[11px] font-semibold text-brand-dark">{step.badge}</span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{step.body}</p>

                {/* Connector arrow (hidden on last card) */}
                {step.number !== '03' && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-surface border border-border rounded-full flex items-center justify-center z-10">
                    <span className="text-muted text-sm font-medium">→</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
