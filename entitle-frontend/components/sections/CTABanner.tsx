import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-24 bg-brand">
      <div className="max-w-6xl mx-auto px-5 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-surface/10 border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-surface animate-pulse" />
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
            Free · No documents needed to start
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
          Find out what you&apos;re owed.
        </h2>
        <p className="text-xl text-white/70 mb-10 max-w-lg mx-auto">
          Takes 2 minutes. No documents needed to start. Our agent does the rest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-surface text-brand hover:bg-surface transition-all duration-150 shadow-lg hover:shadow-xl"
          >
            Check my entitlements
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="text-white/50 text-sm">
            Trusted by 50,000+ families across India
          </div>
        </div>
      </div>
    </section>
  )
}
