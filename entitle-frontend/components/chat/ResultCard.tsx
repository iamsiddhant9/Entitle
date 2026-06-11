import React from 'react'
import type { ChatMessage } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckCircle, TrendingUp } from 'lucide-react'

interface ResultCardProps {
  data: ChatMessage['resultData']
}

const categoryColors: Record<string, 'green' | 'blue' | 'amber' | 'gray'> = {
  agriculture: 'green',
  health: 'blue',
  education: 'blue',
  housing: 'amber',
  pension: 'green',
  welfare: 'gray',
}

function formatAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function formatBig(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function ResultCard({ data }: ResultCardProps) {
  if (!data) return null

  return (
    <div className="bg-surface-green border border-brand/20 rounded-2xl p-4 w-full animate-fadeUp">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-brand uppercase tracking-widest">
            Entitlements Found · Scanning Complete
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-ink tracking-tight">
          {formatBig(data.totalAmount)}
        </div>
        <div className="text-xs text-secondary mt-0.5">
          across {data.schemeCount} schemes
          {data.assetCount > 0 && ` + ${data.assetCount} unclaimed assets`}
        </div>
      </div>

      {/* Entitlements List */}
      <div className="space-y-2 mb-4">
        {data.entitlements.slice(0, 4).map(e => (
          <div
            key={e.id}
            className="flex items-center justify-between py-2 px-3 bg-surface/70 rounded-xl border border-brand/10"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TrendingUp className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="text-sm text-ink font-medium truncate">{e.schemeName}</span>
              <Badge variant={categoryColors[e.category] || 'gray'} className="hidden sm:inline-flex">
                {e.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-sm font-semibold text-brand">{formatAmount(e.annualAmount)}/yr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <Button variant="primary" className="w-full" size="md">
        Apply for all eligible schemes →
      </Button>
    </div>
  )
}
