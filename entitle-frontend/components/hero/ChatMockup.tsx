'use client'
import React, { useEffect, useState } from 'react'
import TypingIndicator from '@/components/chat/TypingIndicator'
import { Send } from 'lucide-react'

const mockSchemes = [
  { name: 'PM Kisan Samman Nidhi', amount: '₹6,000/yr', category: 'Agriculture' },
  { name: 'Pradhan Mantri Ujjwala Yojana', amount: '₹1,600/yr', category: 'Welfare' },
  { name: 'Pradhan Mantri Awas Yojana', amount: '₹2,50,000 subsidy', category: 'Housing' },
]

type Phase = 'greeting' | 'user_msg' | 'typing' | 'result' | 'followup'

export default function ChatMockup() {
  const [phase, setPhase] = useState<Phase>('greeting')

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('user_msg'), 1200),
      setTimeout(() => setPhase('typing'), 2000),
      setTimeout(() => setPhase('result'), 3600),
      setTimeout(() => setPhase('followup'), 4800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden w-full max-w-sm">
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
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-3 min-h-[280px]">
        {/* Agent greeting */}
        <div className="flex justify-start">
          <div className="bg-surface text-ink text-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed">
            Namaste! I&apos;m ENTITLE, your civic rights agent. Tell me a bit about yourself — I&apos;ll find every benefit you&apos;re entitled to. 🙏
          </div>
        </div>

        {/* User message */}
        {phase !== 'greeting' && (
          <div className="flex justify-end animate-fadeUp">
            <div className="bg-white text-background text-sm rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] leading-relaxed">
              I&apos;m 48, carpenter, OBC category, from Nagpur. Family of four.
            </div>
          </div>
        )}

        {/* Typing */}
        {phase === 'typing' && (
          <div className="flex justify-start animate-fadeUp">
            <TypingIndicator />
          </div>
        )}

        {/* Result card */}
        {(phase === 'result' || phase === 'followup') && (
          <div className="animate-fadeUp bg-surface-brand border border-brand/20 rounded-2xl p-3">
            <div className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2">
              ✓ Scanning Complete · 3 schemes found
            </div>
            <div className="text-2xl font-bold text-ink mb-1">₹2,84,600</div>
            <div className="text-xs text-secondary mb-3">estimated annual entitlements</div>
            <div className="space-y-1.5">
              {mockSchemes.map(s => (
                <div key={s.name} className="flex items-center justify-between text-xs bg-surface/70 rounded-lg px-2.5 py-1.5">
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
              I found 3 entitlements for you!{' '}
              <span className="inline-block bg-brand text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                3 can be submitted right now
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
