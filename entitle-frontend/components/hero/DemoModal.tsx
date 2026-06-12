'use client'
import React, { useEffect, useState } from 'react'
import { X, Play } from 'lucide-react'
import { Send } from 'lucide-react'
import TypingIndicator from '@/components/chat/TypingIndicator'

const mockSchemes = [
  { name: 'PM Kisan Samman Nidhi', amount: '₹6,000/yr', category: 'Agriculture' },
  { name: 'Pradhan Mantri Ujjwala Yojana', amount: '₹1,600/yr', category: 'Welfare' },
  { name: 'Pradhan Mantri Awas Yojana', amount: '₹2,50,000 subsidy', category: 'Housing' },
]

type Phase = 'idle' | 'greeting' | 'user_msg' | 'typing' | 'result' | 'followup'

function DemoChat({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (!playing) {
      setPhase('idle')
      return
    }
    // Reset then animate
    setPhase('greeting')
    const timers = [
      setTimeout(() => setPhase('user_msg'), 1400),
      setTimeout(() => setPhase('typing'), 2200),
      setTimeout(() => setPhase('result'), 4000),
      setTimeout(() => setPhase('followup'), 5400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [playing])

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/40">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand border-2 border-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">ENTITLE agent</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] text-secondary">Active · scanning schemes</span>
          </div>
        </div>
        <div className="ml-auto text-[10px] bg-brand/10 text-brand font-semibold px-2 py-1 rounded-full">
          LIVE DEMO
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-3 min-h-[300px]">
        {/* Agent greeting — always visible once playing */}
        {phase !== 'idle' && (
          <div className="flex justify-start animate-fadeUp">
            <div className="bg-surface text-ink text-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed">
              Namaste! I&apos;m ENTITLE, your civic rights agent. Tell me a bit about yourself — I&apos;ll find every benefit you&apos;re entitled to. 🙏
            </div>
          </div>
        )}

        {/* User message */}
        {(phase === 'user_msg' || phase === 'typing' || phase === 'result' || phase === 'followup') && (
          <div className="flex justify-end animate-fadeUp">
            <div className="bg-white text-background text-sm rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] leading-relaxed">
              I&apos;m 48, carpenter, OBC category, from Nagpur. Family of four. Annual income ₹1.2 lakh.
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {phase === 'typing' && (
          <div className="flex justify-start animate-fadeUp">
            <TypingIndicator />
          </div>
        )}

        {/* Result card */}
        {(phase === 'result' || phase === 'followup') && (
          <div className="animate-fadeUp bg-surface-brand border border-brand/20 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2">
              ✓ Scanning Complete · 3 schemes found
            </div>
            <div className="text-3xl font-bold text-ink mb-1">₹2,84,600</div>
            <div className="text-xs text-secondary mb-3">estimated annual entitlements</div>
            <div className="space-y-1.5">
              {mockSchemes.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs bg-surface/70 rounded-lg px-3 py-2">
                  <span className="text-ink font-medium truncate mr-2">{s.name}</span>
                  <span className="text-brand font-semibold shrink-0">{s.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Followup */}
        {phase === 'followup' && (
          <div className="flex justify-start animate-fadeUp">
            <div className="bg-surface text-ink text-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed">
              I found <strong>3 entitlements</strong> worth ₹2.8L/year!{' '}
              <span className="inline-block bg-brand text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                3 can be applied right now →
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
          <input
            type="text"
            placeholder="Reply to ENTITLE…"
            className="flex-1 bg-transparent text-xs text-ink placeholder:text-muted outline-none"
            readOnly
          />
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Send className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoModal() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)

  const openModal = () => {
    setOpen(true)
    setPlaying(false)
    // auto-start after a tiny delay so the modal renders first
    setTimeout(() => setPlaying(true), 150)
  }

  const closeModal = () => {
    setOpen(false)
    setPlaying(false)
  }

  const replay = () => {
    setPlaying(false)
    setTimeout(() => setPlaying(true), 80)
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Trigger button */}
      <button
        id="live-demo-btn"
        onClick={openModal}
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-surface border border-border text-ink hover:border-muted hover:shadow-sm transition-all duration-150"
      >
        <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center">
          <Play className="w-3 h-3 text-white fill-white ml-0.5" />
        </div>
        See a live demo
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

          {/* Modal panel */}
          <div
            className="relative z-10 w-full max-w-md animate-fadeUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Live Demo</h2>
                <p className="text-sm text-white/60">Watch ENTITLE find entitlements in seconds</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={replay}
                  className="text-xs text-white/70 hover:text-white bg-surface/10 hover:bg-surface/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  ↺ Replay
                </button>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-surface/10 hover:bg-surface/20 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <DemoChat playing={playing} />

            <p className="text-center text-xs text-white/40 mt-4">
              This is a simulation · Real results vary by profile
            </p>
          </div>
        </div>
      )}
    </>
  )
}
