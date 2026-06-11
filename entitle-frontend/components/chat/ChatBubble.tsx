import React from 'react'
import type { ChatMessage } from '@/lib/types'

interface ChatBubbleProps {
  message: ChatMessage
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  } catch {
    return ''
  }
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAgent = message.role === 'agent'

  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-3`}>
      <div className={`max-w-[85%] ${isAgent ? '' : ''}`}>
        {isAgent && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-xs text-muted font-medium">ENTITLE</span>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAgent
              ? 'bg-surface text-ink rounded-tl-sm'
              : 'bg-white text-background rounded-tr-sm'
          }`}
        >
          {message.content}
        </div>
        <div className={`mt-1 text-[10px] text-muted ${isAgent ? 'text-left pl-1' : 'text-right pr-1'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
