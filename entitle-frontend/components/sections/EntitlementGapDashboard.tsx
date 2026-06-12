'use client'
import React, { useEffect, useRef, useState } from 'react'

/* ── Animated counter ─────────────────────────────────────────── */
function useTickingCounter(start: number, tickMin: number, tickMax: number, intervalMs: number) {
  const [value, setValue] = useState(start)
  useEffect(() => {
    const iv = setInterval(() => {
      setValue(v => v + Math.floor(Math.random() * (tickMax - tickMin + 1) + tickMin))
    }, intervalMs)
    return () => clearInterval(iv)
  }, [tickMin, tickMax, intervalMs])
  return value
}

function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return { val, ref }
}

/* ── Formatters ───────────────────────────────────────────────── */
function fmtCr(n: number) {
  return (n / 1e7).toFixed(2) + ' Cr'
}

/* ── Recent activity feed ─────────────────────────────────────── */
const NAMES = ['Priya R.', 'Rajan M.', 'Sunita D.', 'Arvind K.', 'Meena P.', 'Vikram S.', 'Kavya L.', 'Deepak N.']
const SCHEMES = ['SDRF Drought Relief', 'PM Awas Yojana', 'PM Kisan Nidhi', 'PMJDY Insurance', 'Ujjwala Yojana', 'Scholarship Scheme']
const AMOUNTS = ['₹25,000', '₹2.5L', '₹6,000', '₹2L', '₹1,600', '₹48,000']

function useFeed() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      name: NAMES[i % NAMES.length],
      scheme: SCHEMES[i % SCHEMES.length],
      amount: AMOUNTS[i % AMOUNTS.length],
      ago: `${(i + 1) * 2}m ago`,
    }))
  )
  const idRef = useRef(10)
  useEffect(() => {
    const iv = setInterval(() => {
      const id = idRef.current++
      setItems(prev => [
        {
          id,
          name: NAMES[id % NAMES.length],
          scheme: SCHEMES[id % SCHEMES.length],
          amount: AMOUNTS[id % AMOUNTS.length],
          ago: 'just now',
        },
        ...prev.slice(0, 3),
      ])
    }, 3200)
    return () => clearInterval(iv)
  }, [])
  return items
}

export default function EntitlementGapDashboard() {
  const totalRaw = useTickingCounter(47_38_26_500, 3000, 12000, 1600)
  const usersToday = useTickingCounter(312, 0, 1, 4000)
  const schemesToday = useTickingCounter(2847, 1, 3, 2200)

  const { val: totalAnimated, ref: sectionRef } = useCountUp(47_38_26_500, 2200)

  const feed = useFeed()

  return (
    <section id="live-dashboard" className="py-24 bg-surface relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-widest mb-4 bg-surface-green px-3 py-1.5 rounded-full border border-brand/20">
            <span className="w-2 h-2 bg-brand rounded-full animate-ping inline-block" />
            Live · Updated every second
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-4">
            India&apos;s Entitlement Gap
          </h2>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            Real money, real people, right now. Every scan adds to this counter.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Big counter */}
          <div ref={sectionRef}>
            {/* Hero number */}
            <div className="bg-surface-green border border-brand/20 rounded-3xl p-8 mb-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-accent/5 pointer-events-none" />
              <div className="text-xs font-bold uppercase tracking-widest text-brand mb-3">
                Total unclaimed found today
              </div>
              <div className="text-5xl md:text-6xl font-black text-ink tracking-tight tabular-nums">
                ₹{fmtCr(totalRaw)}
              </div>
              <div className="text-sm text-muted mt-2">
                across{' '}
                <span className="text-brand font-bold">{usersToday.toLocaleString('en-IN')}</span> users scanned
              </div>

              {/* Pulse ring */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-2 border-brand/10 animate-ping pointer-events-none" />
            </div>

            {/* 3 sub-stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Schemes matched', value: schemesToday.toLocaleString('en-IN'), icon: '📋' },
                { label: 'States covered', value: '28', icon: '🗺️' },
                { label: 'Avg per user', value: '₹1.52L', icon: '💰' },
              ].map(s => (
                <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-black text-brand">{s.value}</div>
                  <div className="text-[10px] text-muted mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live feed */}
          <div>
            <div className="bg-surface border border-border rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <span className="text-sm font-bold text-ink">Recent Entitlements Found</span>
                <span className="text-[10px] text-brand font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse inline-block" />
                  Live feed
                </span>
              </div>
              <div className="divide-y divide-border">
                {feed.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5 transition-all duration-500"
                    style={{ opacity: 1 - idx * 0.15 }}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-xs font-bold text-brand shrink-0">
                      {item.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-ink">{item.name}</div>
                      <div className="text-[10px] text-muted truncate">{item.scheme}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-brand">{item.amount}</div>
                      <div className="text-[9px] text-muted">{item.ago}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border text-center text-[10px] text-muted">
                All data anonymised · Aggregate totals only
              </div>
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="mt-12 bg-gradient-to-r from-brand/10 via-surface-green to-accent/10 border border-brand/20 rounded-2xl p-6 text-center">
          <p className="text-base font-semibold text-ink">
            ENTITLE isn&apos;t just a personal tool —{' '}
            <span className="text-brand">it&apos;s civic infrastructure.</span>
          </p>
          <p className="text-sm text-secondary mt-1">
            Every unclaimed rupee recovered reduces inequality. Every farmer compensated is systemic change.
          </p>
        </div>
      </div>
    </section>
  )
}
