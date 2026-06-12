'use client'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useProfile } from '@/lib/hooks/useProfile'
import { useBenefits } from '@/lib/hooks/useBenefits'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { Notification } from '@/lib/types'

import { Suspense } from 'react'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCivicTab = searchParams.get('tab') === 'civic'

  const { profile, profileId, loading, updateProfile } = useProfile()
  
  const effectiveProfileId = profileId || (isCivicTab ? 'demo-civic' : null)
  const effectiveProfile = profile || (isCivicTab ? {
    id: 'demo-civic',
    name: 'Demo User',
    age: 35,
    gender: 'other',
    location: 'Nagpur',
    caste: 'General',
    occupation: 'Resident',
    maritalStatus: 'single',
    annualIncome: 500000,
    disabilities: 'none',
    familySize: 4,
  } : null)

  const { entitlements, assets, summary } = useBenefits(effectiveProfileId)

  const notifications = useQuery<Notification[]>({
    queryKey: ['notifications', effectiveProfileId],
    queryFn: () => api.getNotifications(effectiveProfileId!),
    enabled: !!effectiveProfileId,
    refetchInterval: 60000,
  })

  // Redirect if no profile
  useEffect(() => {
    if (!loading && !effectiveProfileId) {
      router.push('/onboard')
    }
  }, [loading, effectiveProfileId, router])

  if (loading || !effectiveProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Loading your entitlements…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Dashboard Navbar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-ink tracking-tight">entitle</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted hidden sm:block">
              {effectiveProfile.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {effectiveProfile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <DashboardShell
        profile={effectiveProfile as any}
        entitlements={entitlements.data || []}
        assets={assets.data || []}
        summary={summary.data}
        notifications={notifications.data || []}
        onUpdateProfile={updateProfile}
        onRefresh={() => {
          entitlements.refetch()
          assets.refetch()
          summary.refetch()
        }}
      />
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
