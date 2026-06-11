'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For NGOs', href: '#for-ngos' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-xl font-bold text-ink tracking-tight group-hover:text-brand transition-colors">
            entitle
          </span>
          <span className="w-2 h-2 rounded-full bg-brand mt-0.5 animate-pulse2" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-secondary hover:text-ink transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-border text-secondary hover:text-ink transition-all duration-150"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-ink text-background hover:opacity-90 transition-all duration-150 shadow-sm"
          >
            Check my entitlements
            <span className="text-brand">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile theme toggle */}
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-border bg-surface text-secondary hover:text-ink transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>
          <button
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-secondary hover:text-ink transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/onboard"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-ink text-background hover:opacity-90 transition-all duration-150"
            >
              Check my entitlements <span className="text-brand">→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

