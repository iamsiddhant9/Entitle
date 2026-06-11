'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '@/lib/types'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'
import ResultCard from './ResultCard'
import { Send } from 'lucide-react'

interface ChatWindowProps {
  messages: ChatMessage[]
  isTyping: boolean
  isLoading: boolean
  onSend: (content: string) => void
  className?: string
  placeholder?: string
}

export default function ChatWindow({
  messages,
  isTyping,
  isLoading,
  onSend,
  className = '',
  placeholder = 'Type a message…',
}: ChatWindowProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.type === 'result_card' && msg.resultData ? (
              <div className="py-2">
                <ResultCard data={msg.resultData} />
              </div>
            ) : (
              <ChatBubble message={msg} />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border px-4 py-3 bg-white">
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-brand hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
