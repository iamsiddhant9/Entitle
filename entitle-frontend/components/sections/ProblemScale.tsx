'use client'
import React, { useEffect, useRef, useState } from 'react'

const stats = [
  { prefix: '₹', value: 78000, suffix: ' Cr', label: 'Unclaimed bank deposits lying with RBI', source: 'RBI Annual Report 2023' },
  { prefix: '₹', value: 14000, suffix: ' Cr', label: 'Unclaimed insurance amounts with IRDAI', source: 'IRDAI 2023' },
  { value: 4, suffix: ' crore', label: 'Eligible families not receiving PM-KISAN', source: 'Ministry of Agriculture' },
  { value: 2, suffix: ' crore', label: 'Households missing PMAY housing subsidy', source: 'MoHUA 2023' },
]

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(easeOutCubic(progress) * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

function StatCard({ stat, active }: { stat: typeof stats[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active)
  return (
    <div className="bg-[#242420] rounded-2xl p-8 border border-white/5">
      <div className="text-4xl md:text-5xl font-bold text-brand mb-3 tracking-tight">
        {stat.prefix}{count.toLocaleString('en-IN')}{stat.suffix}
      </div>
      <div className="text-base text-white/80 leading-relaxed mb-2">{stat.label}</div>
      <div className="text-xs text-white/30 font-medium">Source: {stat.source}</div>
    </div>
  )
}

export default function ProblemScale() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-ink" ref={ref}>
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-4 bg-brand/10 px-3 py-1.5 rounded-full border border-brand/20">
            The scale of the problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Billions owed. Never delivered.
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            India has some of the world&apos;s most generous welfare programs. Most eligible people never receive a rupee.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {stats.map(stat => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>

        {/* Footer quote */}
        <div className="text-center">
          <p className="text-white/40 text-sm font-medium tracking-wide">
            The government built the schemes. ENTITLE delivers the last mile.
          </p>
        </div>
      </div>
    </section>
  )
}
