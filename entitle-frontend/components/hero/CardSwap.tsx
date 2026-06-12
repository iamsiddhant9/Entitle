'use client'
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  HTMLAttributes,
} from 'react'
import gsap from 'gsap'

/* ─── Card ─────────────────────────────────────────────────────── */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  customClass?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, children, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card-swap-inner-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

/* ─── Helpers ───────────────────────────────────────────────────── */
const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
})

const placeNow = (
  el: HTMLElement,
  slot: { x: number; y: number; z: number; zIndex: number },
  skew: number
) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  })

/* ─── CardSwap ──────────────────────────────────────────────────── */
interface CardSwapProps {
  children: ReactNode
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  onCardClick?: (idx: number) => void
  skewAmount?: number
  easing?: 'elastic' | 'power'
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
}: CardSwapProps) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        }

  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  )

  const order = useRef<number[]>(childArr.map((_, i) => i))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hovered = useRef(false)

  const runCycle = () => {
    const els = order.current.map(i => refs[i]?.current).filter(Boolean) as HTMLElement[]
    if (els.length < 2) return

    const total = els.length
    const front = els[0]
    const rest = els.slice(1)
    const tl = gsap.timeline()
    tlRef.current = tl

    // Drop front card
    tl.to(front, {
      y: '+=700',
      x: '-=200',
      rotation: -20,
      opacity: 0,
      duration: config.durDrop,
      ease: config.ease,
    })

    // Promote remaining cards
    rest.forEach((el, i) => {
      const targetSlot = makeSlot(i, cardDistance, verticalDistance, total)
      tl.to(
        el,
        {
          x: targetSlot.x,
          y: targetSlot.y,
          z: targetSlot.z,
          zIndex: targetSlot.zIndex,
          skewY: 0,
          duration: config.durMove,
          ease: config.ease,
        },
        config.promoteOverlap
      )
    })

    // Return front card to back
    tl.add(() => {
      order.current = [...order.current.slice(1), order.current[0]]
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
      placeNow(front, backSlot, 0)
      gsap.set(front, { opacity: 1, rotation: 0 })
    })
  }

  useEffect(() => {
    const els = order.current.map(i => refs[i]?.current).filter(Boolean) as HTMLElement[]
    const total = els.length
    els.forEach((el, i) => {
      const slot = makeSlot(i, cardDistance, verticalDistance, total)
      placeNow(el, slot, 0)
    })

    let interval: ReturnType<typeof setInterval>
    const start = () => {
      interval = setInterval(() => {
        if (!hovered.current) runCycle()
      }, delay)
    }
    start()
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, cardDistance, verticalDistance])

  return (
    <div
      className="card-swap-container"
      style={{ width, height, perspective: 900, position: 'relative' }}
      ref={containerRef}
      onMouseEnter={() => { if (pauseOnHover) hovered.current = true }}
      onMouseLeave={() => { if (pauseOnHover) hovered.current = false }}
    >
      {childArr.map((child, i) => {
        if (!isValidElement(child)) return null
        const cardStyle: React.CSSProperties = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          boxSizing: 'border-box',
          padding: '28px',
          overflow: 'hidden',
        }
        return (
          <div
            key={i}
            ref={refs[i]}
            style={cardStyle}
            onClick={() => onCardClick?.(i)}
          >
            {(child as React.ReactElement).props.children ?? child}
          </div>
        )
      })}
    </div>
  )
}

export default CardSwap
