'use client'
import React, { useState } from 'react'
import type { CivicProfile, Entitlement, UnclaimedAsset, ProfileSummary, Notification } from '@/lib/types'
import HeroWidget from './HeroWidget'
import BenefitCard from './BenefitCard'
import TrackerRow from './TrackerRow'
import UnclaimedAssetCard from './UnclaimedAssetCard'
import ProfilePanel from './ProfilePanel'
import { api } from '@/lib/api'
import { Bell, X, Search, ClipboardList, Banknote } from 'lucide-react'

type Tab = 'benefits' | 'tracker' | 'assets' | 'profile'

interface DashboardShellProps {
  profile: CivicProfile
  entitlements: Entitlement[]
  assets: UnclaimedAsset[]
  summary?: ProfileSummary
  notifications?: Notification[]
  onUpdateProfile?: (data: Partial<CivicProfile>) => Promise<CivicProfile | undefined>
  onRefresh?: () => void
}

export default function DashboardShell({
  profile,
  entitlements,
  assets,
  summary,
  notifications = [],
  onUpdateProfile,
  onRefresh,
}: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>('benefits')
  const [isScanning, setIsScanning] = useState(false)
  const [notifDismissed, setNotifDismissed] = useState(false)

  const unreadNotifs = notifications.filter(n => !n.isRead)

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'benefits', label: 'Benefits', count: entitlements.length },
    { id: 'tracker', label: 'Tracker', count: entitlements.filter(e => ['applied', 'submitted', 'approved'].includes(e.status)).length },
    { id: 'assets', label: 'Unclaimed Assets', count: assets.length },
    { id: 'profile', label: 'My Profile' },
  ]

  const handleApplyAll = async () => {
    const eligible = entitlements.filter(e => e.status === 'eligible')
    await Promise.allSettled(eligible.map(e => api.applyForScheme(e.id)))
    onRefresh?.()
  }

  const handleRescan = async () => {
    setIsScanning(true)
    try {
      await api.scanEntitlements(profile.id)
      onRefresh?.()
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* Notification banner */}
        {unreadNotifs.length > 0 && !notifDismissed && (
          <div className="mb-6 flex items-start gap-3 bg-surface-brand border border-brand/20 rounded-2xl px-5 py-4 animate-fadeUp">
            <Bell className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink">{unreadNotifs[0].title}</div>
              <div className="text-sm text-secondary mt-0.5">{unreadNotifs[0].body}</div>
              {unreadNotifs.length > 1 && (
                <div className="text-xs text-muted mt-1">+{unreadNotifs.length - 1} more notifications</div>
              )}
            </div>
            <button
              onClick={() => setNotifDismissed(true)}
              className="p-1 hover:bg-brand/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>
        )}

        {/* Hero widget */}
        <div className="mb-6">
          <HeroWidget
            summary={summary}
            onApplyAll={handleApplyAll}
            onRescan={handleRescan}
            isScanning={isScanning}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl mb-4 sm:mb-6 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-surface text-ink shadow-sm'
                  : 'text-secondary hover:text-ink'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.id ? 'bg-brand/10 text-brand' : 'bg-border text-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'benefits' && (
          <div className="space-y-4">
            {entitlements.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <div className="w-12 h-12 rounded-2xl bg-surface-brand border border-brand/20 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-brand" />
                </div>
                <div className="font-semibold text-ink mb-1">No entitlements yet</div>
                <div className="text-sm">Click &quot;Re-scan schemes&quot; to find your benefits.</div>
              </div>
            ) : (
              entitlements.map(e => (
                <BenefitCard key={e.id} entitlement={e} onApplied={onRefresh} />
              ))
            )}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-3">
            {/* Column headers */}
            <div className="hidden md:flex items-center gap-4 px-5 py-2 text-xs font-bold text-muted uppercase tracking-wider">
              <div className="w-3" />
              <div className="flex-1">Scheme</div>
              <div className="min-w-[140px]">Status</div>
              <div className="min-w-[100px]">Ref no.</div>
              <div className="min-w-[110px]">Applied</div>
              <div className="w-8" />
            </div>
            {entitlements.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <div className="w-12 h-12 rounded-2xl bg-surface-brand border border-brand/20 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6 text-brand" />
                </div>
                <div className="font-semibold text-ink mb-1">No applications yet</div>
                <div className="text-sm">Apply for schemes in the Benefits tab.</div>
              </div>
            ) : (
              entitlements.map(e => <TrackerRow key={e.id} entitlement={e} />)
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {assets.length === 0 ? (
              <div className="col-span-2 text-center py-16 text-muted">
                <div className="w-12 h-12 rounded-2xl bg-surface-brand border border-brand/20 flex items-center justify-center mx-auto mb-3">
                  <Banknote className="w-6 h-6 text-brand" />
                </div>
                <div className="font-semibold text-ink mb-1">No unclaimed assets found</div>
                <div className="text-sm">We&apos;ll notify you if any appear.</div>
              </div>
            ) : (
              assets.map(a => <UnclaimedAssetCard key={a.id} asset={a} />)
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfilePanel profile={profile} onSave={onUpdateProfile} />
        )}
      </div>
    </div>
  )
}
