'use client'
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Children,
  isValidElement,
  cloneElement,
  ReactNode,
} from 'react'

/* ─── Card ─────────────────────────────────────────────────────── */
interface CardProps {
  children: ReactNode
  /** injected by CardSwap — do not set manually */
  style?: React.CSSProperties
  className?: string
}

export function Card({ children, style, className = '' }: CardProps) {
  return (
    <div
      className={`card-swap-card ${className}`}
      style={{
        position: 'absolute',
        width: '100%',
        borderRadius: '20px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '28px',
        boxSizing: 'border-box',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── CardSwap ──────────────────────────────────────────────────── */
interface CardSwapProps {
  children: ReactNode
  /** horizontal spread between cards (px) */
  cardDistance?: number
  /** vertical offset per stack level (px) */
  verticalDistance?: number
  /** ms between auto-advances */
  delay?: number
  /** pause cycling when mouse is over the stack */
  pauseOnHover?: boolean
  /** card height (px) — used to set the container height */
  cardHeight?: number
}

export default function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  cardHeight = 320,
}: CardSwapProps) {
  const cards = Children.toArray(children).filter(isValidElement)
  const total = cards.length
  const [active, setActive] = useState(0)
  const paused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advance = useCallback(() => {
    setActive(prev => (prev + 1) % total)
  }, [total])

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!paused.current) advance()
    }, delay)
  }, [advance, delay])

  useEffect(() => {
    scheduleNext()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, scheduleNext])

  /* Compute per-card style based on distance from active */
  const getCardStyle = (index: number): React.CSSProperties => {
    // position in the visual stack: 0 = front, 1 = second, …
    const stackPos = (index - active + total) % total
    const isFront = stackPos === 0
    const isBack = stackPos === total - 1

    const translateX = isFront ? 0 : stackPos * -(cardDistance / (total - 1))
    const translateY = isFront ? 0 : stackPos * (verticalDistance / (total - 1))
    const scale = 1 - stackPos * 0.04
    const opacity = isBack && total > 3 ? 0 : 1 - stackPos * 0.08
    const zIndex = total - stackPos
    const blur = stackPos > 0 ? `${stackPos * 0.5}px` : '0'

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur})`,
      transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
      cursor: isFront ? 'default' : 'pointer',
    }
  }

  return (
    <div
      style={{ position: 'relative', height: cardHeight + verticalDistance }}
      onMouseEnter={() => { if (pauseOnHover) paused.current = true }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          paused.current = false
          scheduleNext()
        }
      }}
    >
      {cards.map((card, i) => {
        const style = getCardStyle(i)
        return cloneElement(card as React.ReactElement<CardProps>, {
          key: i,
          style: { ...(card as React.ReactElement<CardProps>).props.style, ...style },
        })
      })}
    </div>
  )
}
