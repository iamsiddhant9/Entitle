'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import type { Entitlement, UnclaimedAsset, ProfileSummary } from '../types'

export function useBenefits(profileId: string | null) {
  const entitlements = useQuery<Entitlement[]>({
    queryKey: ['entitlements', profileId],
    queryFn: () => api.getEntitlements(profileId!),
    enabled: !!profileId,
    refetchInterval: 30000,
  })

  const assets = useQuery<UnclaimedAsset[]>({
    queryKey: ['assets', profileId],
    queryFn: () => api.getUnclaimedAssets(profileId!),
    enabled: !!profileId,
    refetchInterval: 30000,
  })

  const summary = useQuery<ProfileSummary>({
    queryKey: ['summary', profileId],
    queryFn: () => api.getProfileSummary(profileId!),
    enabled: !!profileId,
    refetchInterval: 30000,
  })

  return { entitlements, assets, summary }
}
