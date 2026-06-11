'use client'
import React, { useState } from 'react'
import type { Entitlement, UnclaimedAsset } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { ChevronDown, ChevronUp, ExternalLink, AlertCircle } from 'lucide-react'

interface BenefitCardProps {
  entitlement: Entitlement
  onApplied?: () => void
}

const statusConfig: Record<string, { label: string; variant: 'green' | 'blue' | 'amber' | 'red' | 'gray' }> = {
  eligible: { label: 'Eligible', variant: 'gray' },
  applied: { label: 'Applied', variant: 'blue' },
  submitted: { label: 'Submitted', variant: 'blue' },
  approved: { label: 'Approved', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
  needs_docs: { label: 'Needs Docs', variant: 'amber' },
}

const categoryLabels: Record<string, string> = {
  agriculture: 'Agriculture',
  health: 'Health',
  education: 'Education',
  housing: 'Housing',
  pension: 'Pension',
  welfare: 'Welfare',
}

function formatAmount(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function BenefitCard({ entitlement, onApplied }: BenefitCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const status = statusConfig[entitlement.status] || statusConfig.eligible
  const confidence = Math.round(entitlement.confidence * 100)

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setApplying(true)
    try {
      await api.applyForScheme(entitlement.id)
      setApplied(true)
      onApplied?.()
    } catch {
      // ignore
    } finally {
      setApplying(false)
    }
  }

  return (
    <div
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-muted hover:shadow-sm transition-all duration-200"
    >
      {/* Main row */}
      <div
        className="px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="gray">{categoryLabels[entitlement.scheme.category] || entitlement.scheme.category}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
              {entitlement.scheme.level === 'central' && (
                <Badge variant="dark">Central</Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-ink mb-1 truncate">{entitlement.scheme.name}</h3>
            <p className="text-xs text-muted">{entitlement.scheme.department}</p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-xl font-bold text-brand">{formatAmount(entitlement.annualAmount)}</div>
            <div className="text-[10px] text-muted">per year</div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-muted font-medium">Match confidence</span>
            <span className="text-[11px] font-bold text-brand">{confidence}%</span>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4">
          <div className="mb-4">
            <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Eligibility</div>
            <p className="text-sm text-secondary leading-relaxed">{entitlement.scheme.eligibilitySummary}</p>
          </div>

          {entitlement.missingDocuments && entitlement.missingDocuments.length > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Missing documents</span>
              </div>
              <ul className="space-y-1">
                {entitlement.missingDocuments.map((doc, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span> {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            {(entitlement.status === 'eligible' || entitlement.status === 'needs_docs') && !applied && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? 'Applying…' : 'Apply now'}
              </Button>
            )}
            {applied && (
              <Badge variant="green">Application submitted!</Badge>
            )}
            {entitlement.scheme.portalUrl && (
              <a
                href={entitlement.scheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
              >
                View portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {entitlement.applicationRef && (
              <span className="text-xs text-muted">Ref: {entitlement.applicationRef}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
