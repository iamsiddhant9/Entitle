import React from 'react'
import type { ProfileSummary } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { RefreshCw, ArrowRight } from 'lucide-react'

interface HeroWidgetProps {
  summary?: ProfileSummary
  onApplyAll?: () => void
  onRescan?: () => void
  isScanning?: boolean
}

function formatAmount(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function formatRelativeTime(iso?: string) {
  if (!iso) return 'Never scanned'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function HeroWidget({ summary, onApplyAll, onRescan, isScanning }: HeroWidgetProps) {
  const total = (summary?.totalAnnualAmount || 0) + (summary?.assetTotal || 0)
  const confidence = summary?.schemeCount ? Math.min(95, 70 + summary.schemeCount * 3) : 0

  return (
    <div className="bg-ink rounded-2xl p-5 sm:p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left */}
        <div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
            Your total annual entitlements
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-2">
            {summary ? formatAmount(total) : '—'}
          </div>
          <div className="text-sm text-white/50">
            Across {summary?.schemeCount || 0} schemes
            {summary && summary.assetCount > 0 && ` + ${summary.assetCount} unclaimed assets`}
          </div>

          {/* Confidence bar */}
          {summary && (
            <div className="mt-5 max-w-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/40 font-medium">Profile completeness</span>
                <span className="text-xs font-bold text-brand">{confidence}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-700"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}

          {/* Last scan */}
          <div className="mt-4 text-xs text-white/30">
            Last scanned: {formatRelativeTime(summary?.lastScanned)}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 shrink-0 mt-2 md:mt-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onApplyAll}
          >
            Apply for all
            <ArrowRight className="w-4 h-4" />
          </Button>
          <button
            onClick={onRescan}
            disabled={isScanning}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-150 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning…' : 'Re-scan schemes'}
          </button>
        </div>
      </div>
    </div>
  )
}
