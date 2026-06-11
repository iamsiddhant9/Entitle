'use client'
import React, { useEffect, useRef, useState } from 'react'

interface StatItem {
  prefix?: string
  value: number
  suffix?: string
  label: string
  note?: string
}

const stats: StatItem[] = [
  { prefix: '₹', value: 78000, suffix: ' Cr', label: 'Unclaimed bank deposits', note: 'RBI data' },
  { value: 9, suffix: ' min', label: 'Average time to scan', note: 'avg per user' },
  { value: 1200, suffix: '+', label: 'Schemes across all states' },
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

function Stat({ stat, active }: { stat: StatItem; active: boolean }) {
  const count = useCountUp(stat.value, 1500, active)
  return (
    <div className="flex flex-col items-center text-center px-6 py-4 border-r border-border last:border-0">
      <div className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
        {stat.prefix}{count.toLocaleString('en-IN')}{stat.suffix}
      </div>
      <div className="text-xs text-muted mt-1 font-medium">{stat.label}</div>
      {stat.note && <div className="text-[10px] text-muted/70 mt-0.5">{stat.note}</div>}
    </div>
  )
}

export default function StatBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="inline-flex divide-x divide-border bg-white border border-border rounded-2xl shadow-sm overflow-hidden mt-10"
    >
      {stats.map(stat => (
        <Stat key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  )
}
