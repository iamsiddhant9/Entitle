import React from 'react'
import type { Entitlement } from '@/lib/types'
import { ExternalLink, Circle } from 'lucide-react'

interface TrackerRowProps {
  entitlement: Entitlement
}

const statusDotColor: Record<string, string> = {
  eligible: 'text-muted',
  applied: 'text-blue-500',
  submitted: 'text-blue-600',
  approved: 'text-brand',
  rejected: 'text-red-500',
  needs_docs: 'text-amber-500',
}

const statusLabel: Record<string, string> = {
  eligible: 'Eligible — not applied',
  applied: 'Applied',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_docs: 'Documents needed',
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TrackerRow({ entitlement }: TrackerRowProps) {
  const dotColor = statusDotColor[entitlement.status] || 'text-muted'
  const label = statusLabel[entitlement.status] || entitlement.status

  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-surface border border-border rounded-2xl hover:border-muted transition-all duration-200">
      {/* Status dot */}
      <Circle className={`w-3 h-3 fill-current shrink-0 ${dotColor}`} />

      {/* Scheme info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink truncate">{entitlement.scheme.name}</div>
        <div className="text-xs text-muted">{entitlement.scheme.department}</div>
      </div>

      {/* Status */}
      <div className="hidden sm:block text-sm text-secondary min-w-[140px]">
        {label}
      </div>

      {/* Ref */}
      <div className="hidden md:block text-xs text-muted min-w-[100px]">
        {entitlement.applicationRef || '—'}
      </div>

      {/* Date */}
      <div className="hidden lg:block text-xs text-muted min-w-[110px]">
        {formatDate(entitlement.appliedAt)}
      </div>

      {/* Portal link */}
      {entitlement.scheme.portalUrl ? (
        <a
          href={entitlement.scheme.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-lg hover:bg-surface transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-muted hover:text-accent" />
        </a>
      ) : (
        <div className="w-8" />
      )}
    </div>
  )
}
