'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ChatWindow from '@/components/chat/ChatWindow'
import { useChat } from '@/lib/hooks/useChat'
import { useProfile } from '@/lib/hooks/useProfile'
import { CheckCircle, Circle } from 'lucide-react'
import { api } from '@/lib/api'

// Fields we collect progressively
const progressFields = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'state', label: 'State' },
  { key: 'casteCategory', label: 'Caste category' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'annualIncome', label: 'Annual income' },
  { key: 'familySize', label: 'Family size' },
]

export default function OnboardPage() {
  const router = useRouter()
  const { profile, profileId, loading, createProfile } = useProfile()

  // Always use stable 'onboard' ID for the hook so messages never reset.
  // We update the ref inside the hook when a real profile is created.
  const { messages, isTyping, isLoading, sendMessage, addInitialMessage, setProfileId } = useChat('onboard')

  const [collectedFields, setCollectedFields] = useState<string[]>([])
  const [navigating, setNavigating] = useState(false)
  const profileCreatedRef = useRef(false)
  const isCreatingProfileRef = useRef(false)

  // Show initial greeting once on mount
  useEffect(() => {
    addInitialMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If user already has a profile, send them straight to dashboard
  useEffect(() => {
    if (!loading && profileId && profile) {
      router.push('/dashboard')
    }
  }, [loading, profileId, profile, router])

  // Intercept sends: create a real profile on first user message, then
  // update the hook's profileId ref so subsequent API calls use it
  const handleSend = async (content: string) => {
    if (!profileCreatedRef.current && !isCreatingProfileRef.current && !profileId) {
      profileCreatedRef.current = true
      isCreatingProfileRef.current = true
      try {
        const p = await createProfile({
          name: 'Pending',
          age: 0,
          state: 'unknown',
          district: 'unknown',
          casteCategory: 'general',
          annualIncome: 0,
          occupation: 'other',
          familySize: 1,
          bplCard: false,
          aadhaarLinked: false,
          panLinked: false,
          familyMembers: [],
        })
        if (p?.id) {
          setProfileId(p.id)
        }
      } catch {
        // Profile creation failed — continue with mock 'onboard' mode
        profileCreatedRef.current = false
      } finally {
        isCreatingProfileRef.current = false
      }
    }
    sendMessage(content)
  }

  // Detect field collection from messages (simplified heuristic)
  useEffect(() => {
    const agentMessages = messages.filter(m => m.role === 'agent').map(m => m.content.toLowerCase())
    const detected: string[] = []
    if (agentMessages.some(m => m.includes('name')) && messages.some(u => u.role === 'user')) detected.push('name')
    if (messages.some(m => m.role === 'user' && /\d{2,3}/.test(m.content))) detected.push('age')
    if (messages.length > 4) detected.push('state')
    if (messages.length > 6) detected.push('casteCategory', 'occupation')
    if (messages.length > 8) detected.push('annualIncome', 'familySize')
    setCollectedFields(detected)
  }, [messages])

  // Watch for result_card — backend signals profile complete & scan done
  useEffect(() => {
    if (navigating) return
    const resultCard = messages.find(m => m.role === 'agent' && m.type === 'result_card')
    if (resultCard) {
      setNavigating(true)
      setTimeout(() => router.push('/dashboard'), 1500)
      return
    }

    // Fallback: redirect after enough exchanges
    const activeProfileId = profileId
    if (messages.length >= 10 && activeProfileId && !navigating) {
      setNavigating(true)
      api.scanEntitlements(activeProfileId).catch(() => {})
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }, [messages, profileId, navigating, router])

  const progress = Math.round((collectedFields.length / progressFields.length) * 100)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left sidebar — hidden on mobile */}
      <div className="hidden lg:flex flex-col w-72 border-r border-border bg-white p-6 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 mb-8">
          <span className="text-xl font-bold text-ink tracking-tight">entitle</span>
          <span className="w-2 h-2 rounded-full bg-brand" />
        </Link>

        <div className="mb-6">
          <div className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Profile being built</div>
          <div className="h-2 bg-surface rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted">{progress}% complete</div>
        </div>

        <div className="space-y-3">
          {progressFields.map(field => {
            const done = collectedFields.includes(field.key)
            return (
              <div key={field.key} className="flex items-center gap-2.5">
                {done ? (
                  <CheckCircle className="w-4 h-4 text-brand shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted shrink-0" />
                )}
                <span className={`text-sm ${done ? 'text-ink font-medium' : 'text-muted'}`}>
                  {field.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-border">
          <p className="text-xs text-muted leading-relaxed">
            Your data is encrypted and never shared. ENTITLE is completely free.
          </p>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-ink">entitle</span>
            <span className="w-2 h-2 rounded-full bg-brand" />
          </Link>
          <div className="text-xs text-muted">{progress}% complete</div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-white">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand border-2 border-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">ENTITLE agent</div>
            <div className="text-xs text-muted">Building your civic profile · Free</div>
          </div>
          {navigating && (
            <div className="ml-auto flex items-center gap-2 text-xs text-brand font-medium">
              <div className="w-3 h-3 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              Taking you to your entitlements…
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            isLoading={isLoading}
            onSend={handleSend}
            placeholder="Reply to ENTITLE…"
          />
        </div>
      </div>
    </div>
  )
}
