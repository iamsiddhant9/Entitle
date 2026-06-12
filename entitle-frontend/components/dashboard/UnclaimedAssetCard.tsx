'use client'
import React, { useState } from 'react'
import type { UnclaimedAsset } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Banknote, Shield, TrendingUp, Briefcase } from 'lucide-react'

interface UnclaimedAssetCardProps {
  asset: UnclaimedAsset
}

const typeIcons = {
  bank_account: Banknote,
  insurance: Shield,
  dividend: TrendingUp,
  pension: Briefcase,
}

const typeLabels = {
  bank_account: 'Bank Account',
  insurance: 'Insurance',
  dividend: 'Dividend',
  pension: 'Pension',
}

const sourceColors: Record<string, 'green' | 'blue' | 'amber'> = {
  RBI: 'green',
  IRDAI: 'amber',
  SEBI: 'blue',
}

function formatAmount(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function UnclaimedAssetCard({ asset }: UnclaimedAssetCardProps) {
  const [claiming, setClaiming] = useState(false)
  const [instructions, setInstructions] = useState<string | null>(null)
  const [claimed, setClaimed] = useState(asset.isClaimed)

  const Icon = typeIcons[asset.type] || Banknote

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const result = await api.claimAsset(asset.id)
      setInstructions(result.claimInstructions)
      setClaimed(true)
    } catch {
      // ignore
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-muted hover:shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-brand flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">{asset.institution}</h3>
            <p className="text-xs text-muted">{typeLabels[asset.type]}</p>
          </div>
        </div>
        <Badge variant={sourceColors[asset.source] || 'gray'}>{asset.source}</Badge>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-brand">{formatAmount(asset.amount)}</div>
        <div className="text-xs text-muted mt-0.5">Ref: {asset.reference}</div>
      </div>

      {/* Claim instructions */}
      {instructions && (
        <div className="mb-4 bg-surface-brand border border-brand/20 rounded-xl p-3 text-sm text-secondary leading-relaxed">
          {instructions}
        </div>
      )}

      {/* Action */}
      {claimed ? (
        <Badge variant="green">Claim initiated</Badge>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={handleClaim}
          disabled={claiming}
        >
          {claiming ? 'Initiating…' : 'Initiate Claim'}
        </Button>
      )}
    </div>
  )
}
