'use client'
import { useState, useEffect } from 'react'
import { api } from '../api'
import type { CivicProfile } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<CivicProfile | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('entitle_profile_id')
    if (stored) {
      setProfileId(stored)
      api.getProfile(stored).then(setProfile).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const createProfile = async (data: Partial<CivicProfile>) => {
    setLoading(true)
    try {
      const p = await api.createProfile(data)
      setProfile(p)
      setProfileId(p.id)
      localStorage.setItem('entitle_profile_id', p.id)
      return p
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<CivicProfile>) => {
    if (!profileId) return
    const p = await api.updateProfile(profileId, data)
    setProfile(p)
    return p
  }

  return { profile, profileId, loading, createProfile, updateProfile }
}
