import React from 'react'

interface StatChipProps {
  value: string
  label: string
}

export function StatChip({ value, label }: StatChipProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold text-ink tracking-tight">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  )
}
