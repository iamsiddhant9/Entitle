'use client'
import React, { useState, useEffect } from 'react'

const sequences = [
  {
    l1: "Your money.",
    l2: "Your rights.",
    l3: "Automatically claimed."
  },
  {
    l1: "आपका पैसा।",
    l2: "आपके अधिकार।",
    l3: "स्वतः प्राप्त।"
  },
  {
    l1: "तुमचा पैसा.",
    l2: "तुमचे अधिकार.",
    l3: "आपोआप प्राप्त."
  },
  {
    l1: "మీ డబ్బు.",
    l2: "మీ హక్కులు.",
    l3: "ఆటోమెటిక్‌గా పొందబడ్డాయి."
  },
  {
    l1: "તમારા પૈસા.",
    l2: "તમારા અધિકારો.",
    l3: "આપમેળે પ્રાપ્ત."
  },
  {
    l1: "Your money.",
    l2: "Your rights.",
    l3: "Automatically claimed."
  }
]

export default function TypewriterTitle() {
  const [seqIdx, setSeqIdx] = useState(0)
  const [displayedText, setDisplayedText] = useState({ l1: '', l2: '', l3: '' })
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'done'>('typing')

  useEffect(() => {
    if (phase === 'done') return

    const currentTarget = sequences[seqIdx]
    
    let timeoutId: NodeJS.Timeout

    if (phase === 'typing') {
      const { l1, l2, l3 } = displayedText
      if (l1 !== currentTarget.l1) {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l1: currentTarget.l1.slice(0, l1.length + 1) })
        }, 50)
      } else if (l2 !== currentTarget.l2) {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l2: currentTarget.l2.slice(0, l2.length + 1) })
        }, 50)
      } else if (l3 !== currentTarget.l3) {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l3: currentTarget.l3.slice(0, l3.length + 1) })
        }, 50)
      } else {
        // finished typing current sequence
        if (seqIdx === sequences.length - 1) {
          setPhase('done')
        } else {
          setPhase('pausing')
        }
      }
    } else if (phase === 'pausing') {
      timeoutId = setTimeout(() => {
        setPhase('deleting')
      }, 1500)
    } else if (phase === 'deleting') {
      const { l1, l2, l3 } = displayedText
      if (l3 !== '') {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l3: l3.slice(0, l3.length - 1) })
        }, 20)
      } else if (l2 !== '') {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l2: l2.slice(0, l2.length - 1) })
        }, 20)
      } else if (l1 !== '') {
        timeoutId = setTimeout(() => {
          setDisplayedText({ ...displayedText, l1: l1.slice(0, l1.length - 1) })
        }, 20)
      } else {
        // finished deleting
        setSeqIdx(prev => prev + 1)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayedText, phase, seqIdx])

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-ink leading-[1.15] md:leading-[1.08] tracking-tight mb-6 h-[140px] sm:h-[180px] md:h-[210px] lg:h-[220px] flex flex-col justify-end">
      <span>{displayedText.l1}</span>
      <span className="text-brand">{displayedText.l2}</span>
      <span>
        {displayedText.l3}
        {phase !== 'done' && <span className="animate-pulse ml-1">|</span>}
      </span>
    </h1>
  )
}
