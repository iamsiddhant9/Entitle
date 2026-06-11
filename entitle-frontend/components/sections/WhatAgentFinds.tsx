import React from 'react'
import { Landmark, Banknote, Shield, TrendingUp } from 'lucide-react'

const finds = [
  {
    emoji: '🏛️',
    Icon: Landmark,
    title: 'Government schemes',
    body: '1,200+ central and state schemes including PM-KISAN, PMAY, Ujjwala, scholarship programs, health insurance, and pension plans. Matched to your exact profile.',
    count: '1,200+ schemes',
    color: 'bg-blue-50 text-accent',
  },
  {
    emoji: '🏦',
    Icon: Banknote,
    title: 'Dormant bank accounts',
    body: 'Accounts inactive for 10+ years transfer to RBI\'s DEAF fund. ENTITLE checks your name and family details across all registered banks to surface unclaimed balances.',
    count: '₹78,000 Cr pool',
    color: 'bg-surface-green text-brand',
  },
  {
    emoji: '🛡️',
    Icon: Shield,
    title: 'Unclaimed insurance',
    body: 'Policies where nominees never claimed — LIC, GIC, private insurers. IRDAI\'s Bima Bharosa registry is cross-referenced against your family history.',
    count: '₹14,000 Cr unclaimed',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    emoji: '📈',
    Icon: TrendingUp,
    title: 'Unpaid dividends',
    body: 'IEPF holds dividends and shares for 7+ years when investors go untraceable. ENTITLE surfaces forgotten investments using SEBI and registrar data.',
    count: 'SEBI/IEPF tracked',
    color: 'bg-purple-50 text-purple-700',
  },
]

export default function WhatAgentFinds() {
  return (
    <section id="what-we-find" className="py-24 bg-surface/40">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-4 bg-surface-green px-3 py-1.5 rounded-full border border-brand/20">
            What the agent finds
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
            Four sources. One agent.
          </h2>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            ENTITLE aggregates every source of money the government and financial institutions owe you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {finds.map(item => {
            const Icon = item.Icon
            return (
              <div
                key={item.title}
                className="bg-surface border border-border rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-secondary leading-relaxed mb-4">{item.body}</p>
                <div className="text-xs font-bold text-muted uppercase tracking-wider border-t border-border pt-3">
                  {item.count}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
