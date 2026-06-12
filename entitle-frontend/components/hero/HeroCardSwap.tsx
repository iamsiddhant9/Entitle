'use client'
import React from 'react'
import CardSwap, { Card } from './CardSwap'

/* ── Satellite + AI card ─────────────────────────────────────── */
function SatelliteCard() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center text-xl">🛰️</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand">Satellite + AI</div>
          <div className="text-sm font-bold text-ink">Crop Intelligence</div>
        </div>
      </div>

      {/* Mock satellite scan strip */}
      <div className="relative rounded-xl overflow-hidden h-28 mb-4 bg-gradient-to-br from-[#2a4a2a] via-[#3a6a3a] to-[#4a7a3a]">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 6px,rgba(136,189,242,0.15) 6px,rgba(136,189,242,0.15) 7px),repeating-linear-gradient(90deg,transparent,transparent 6px,rgba(136,189,242,0.1) 6px,rgba(136,189,242,0.1) 7px)' }}
        />
        {/* Scan line animation */}
        <div className="absolute inset-x-0 h-0.5 bg-brand/70 animate-[scan_2s_linear_infinite]" style={{ top: '40%' }} />
        <div className="absolute top-2 left-2 text-[9px] font-mono text-brand/80 bg-black/40 px-1.5 py-0.5 rounded">
          NDVI · Satara, MH
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1">
          {['#c8f090','#90d060','#d4a060','#d06030'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-red-300/90 bg-black/40 px-1.5 py-0.5 rounded">
          ⚠ Drought Detected
        </div>
      </div>

      <div className="bg-brand/10 border border-brand/20 rounded-xl p-3">
        <div className="text-[10px] text-brand font-semibold uppercase tracking-wider mb-1">AI Recommendation</div>
        <p className="text-xs text-ink leading-relaxed">
          Your land appears <span className="text-red-400 font-semibold">drought-affected</span>.
          You may qualify for <span className="text-brand font-bold">₹25,000</span> compensation under SDRF.
        </p>
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse inline-block" />
          Auto-applying now
        </div>
      </div>
    </Card>
  )
}

/* ── Live Entitlement Gap card ───────────────────────────────── */
function LiveDashboardCard() {
  const [count, setCount] = React.useState(47382650)
  const [users, setUsers] = React.useState(312)
  React.useEffect(() => {
    const iv = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 8000 + 2000))
      setUsers(u => u + (Math.random() > 0.7 ? 1 : 0))
    }, 1800)
    return () => clearInterval(iv)
  }, [])

  const fmt = (n: number) => {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`
    return `₹${n.toLocaleString('en-IN')}`
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-xl">🏛️</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Civic Infrastructure</div>
          <div className="text-sm font-bold text-ink">Live Entitlement Gap</div>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[9px] font-bold text-brand bg-brand/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-ping inline-block" />
          LIVE
        </div>
      </div>

      <div className="text-center py-4 border border-border rounded-xl mb-4 bg-surface-green/30">
        <div className="text-3xl font-black text-ink tracking-tight tabular-nums">{fmt(count)}</div>
        <div className="text-xs text-muted mt-1">found for <span className="text-brand font-bold">{users} users</span> today</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Schemes\nMatched', value: '2,847' },
          { label: 'States\nCovered', value: '28' },
          { label: 'Avg per\nUser', value: '₹1.5L' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-2.5 text-center">
            <div className="text-base font-bold text-brand">{s.value}</div>
            <div className="text-[9px] text-muted mt-0.5 whitespace-pre-line leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ── Proof of Entitlement card ───────────────────────────────── */
function BlockchainCard() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-xl">🔗</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Polygon Network</div>
          <div className="text-sm font-bold text-ink">Proof of Entitlement</div>
        </div>
      </div>

      {/* Mock certificate */}
      <div className="border border-purple-400/30 rounded-xl p-3 mb-3 bg-gradient-to-br from-purple-500/5 to-brand/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400">Entitlement Certificate</span>
          <span className="text-[9px] bg-purple-400/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">✓ On-chain</span>
        </div>
        <div className="text-xs text-ink font-semibold mb-1">PM Kisan Samman Nidhi</div>
        <div className="text-[9px] text-muted font-mono mb-2">0x3f8a...d92c · Block #48,291,033</div>
        <div className="h-px bg-border mb-2" />
        <div className="flex justify-between text-[9px] text-muted">
          <span>Issued: {new Date().toLocaleDateString('en-IN')}</span>
          <span className="text-brand font-semibold">Polygon PoS</span>
        </div>
      </div>

      <div className="text-xs text-secondary leading-relaxed">
        <span className="text-brand font-semibold">Tamper-proof.</span> If a government office disputes your eligibility, 
        this timestamp proves you were found eligible on this date.
      </div>
    </Card>
  )
}

/* ── Core AI Match card ──────────────────────────────────────── */
function CoreAICard() {
  const schemes = [
    { name: 'PM Awas Yojana', amount: '₹2.5L', match: 98 },
    { name: 'SDRF Drought Relief', amount: '₹25,000', match: 94 },
    { name: 'PMJDY Insurance', amount: '₹2L', match: 91 },
  ]
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center text-xl">🤖</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand">AI Agent</div>
          <div className="text-sm font-bold text-ink">Scheme Matching</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {schemes.map(s => (
          <div key={s.name} className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
            <div className="flex-1">
              <div className="text-xs font-semibold text-ink">{s.name}</div>
              <div className="text-[10px] text-muted">{s.amount}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-brand">{s.match}%</div>
              <div className="text-[9px] text-muted">match</div>
            </div>
            <div className="w-1.5 h-8 rounded-full bg-border overflow-hidden">
              <div className="w-full bg-brand rounded-full" style={{ height: `${s.match}%`, marginTop: `${100-s.match}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted text-center">
        Scanning <span className="text-brand font-bold">1,200+</span> schemes across all states
      </div>
    </Card>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export default function HeroCardSwap() {
  return (
    <div style={{ height: '420px', position: 'relative' }}>
      <CardSwap
        cardDistance={50}
        verticalDistance={60}
        delay={4500}
        pauseOnHover={true}
        cardHeight={320}
      >
        <SatelliteCard />
        <LiveDashboardCard />
        <BlockchainCard />
        <CoreAICard />
      </CardSwap>
    </div>
  )
}
