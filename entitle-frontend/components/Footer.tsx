import React from 'react'
import Link from 'next/link'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'What we find', href: '#what-we-find' },
  { label: 'Features', href: '#features' },
  { label: 'For NGOs', href: '#for-ngos' },
  { label: 'About', href: '#about' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-14">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Left: Logo + tagline */}
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-3">
              <span className="text-xl font-bold text-white tracking-tight">entitle</span>
              <span className="w-2 h-2 rounded-full bg-brand" />
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              India&apos;s first autonomous civic rights agent. Your money. Your rights. Automatically claimed.
            </p>
          </div>

          {/* Right: Nav links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/40 hover:text-white/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} ENTITLE Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Built in India 🇮🇳 · Not affiliated with any government body
          </p>
        </div>
      </div>
    </footer>
  )
}
