'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage } from '../types'
import { api } from '../api'

export function useChat(initialProfileId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Store the latest profileId in a ref so sendMessage always uses
  // the most-current value without causing a re-render / hook re-init
  const profileIdRef = useRef(initialProfileId)
  useEffect(() => {
    profileIdRef.current = initialProfileId
  }, [initialProfileId])

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Allow the parent to update the profileId used for API calls
  // without resetting the messages array
  const setProfileId = useCallback((id: string) => {
    profileIdRef.current = id
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setIsLoading(true)

    try {
      const response = await api.sendChatMessage(
        profileIdRef.current,
        content,
        messagesRef.current.length,
      )
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: response.id || Date.now().toString(),
          role: 'agent',
          content: response.content,
          // Backend sends snake_case; support both for resilience
          timestamp: response.timestamp || (response as any).created_at || new Date().toISOString(),
          type: (response as any).message_type || response.type || 'text',
          resultData: (response as any).result_data || response.resultData,
        }
      ])
    } catch {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: 'Sorry, I had trouble connecting. Please try again.',
          timestamp: new Date().toISOString(),
          type: 'text',
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const addInitialMessage = useCallback(() => {
    setMessages(prev => {
      // Don't add if already initialized
      if (prev.length > 0) return prev
      return [{
        id: '0',
        role: 'agent',
        content: 'Namaste! I am ENTITLE, your civic rights agent. I will help you find every government scheme and benefit you are entitled to — completely free. To start, could you tell me your name and age?',
        timestamp: new Date().toISOString(),
        type: 'text',
      }]
    })
  }, [])

  return { messages, isTyping, isLoading, sendMessage, addInitialMessage, setProfileId }
}
