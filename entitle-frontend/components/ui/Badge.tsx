import React from 'react'

type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'dark'

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-surface-brand text-brand-dark border border-brand/20',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  gray: 'bg-surface text-secondary border border-border',
  dark: 'bg-white text-background border border-ink',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
