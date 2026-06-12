import React from 'react'
import Link from 'next/link'
import StatBar from './StatBar'
import HeroCardSwap from './HeroCardSwap'
import DemoModal from './DemoModal'
import TypewriterTitle from './TypewriterTitle'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Copy */}
          <div className="lg:pt-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-surface-brand border border-brand/20 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
              </span>
              <span className="text-xs font-semibold text-brand-dark">
                India&apos;s first autonomous civic rights agent
              </span>
            </div>

            {/* H1 */}
            <TypewriterTitle />

            {/* Subtext */}
            <p className="text-lg text-secondary leading-relaxed mb-8 max-w-lg">
              ENTITLE is an AI agent that scans 1,200+ government schemes and tracks your unclaimed bank deposits, insurance, and dividends — then applies for them autonomously. No middlemen. No fees.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-brand text-white hover:bg-brand-dark transition-all duration-150 shadow-md hover:shadow-lg"
              >
                Find my entitlements
                <ArrowRight className="w-4 h-4" />
              </Link>
              <DemoModal />
            </div>

            <p className="text-xs text-muted">
              Free forever · No documents needed to start · Takes 2 minutes
            </p>

            {/* Stat bar */}
            <div className="mt-8">
              <StatBar />
            </div>
          </div>

          {/* Right: CardSwap feature showcase */}
          <div className="flex justify-center lg:justify-end w-full mt-16 lg:mt-0 lg:pt-52">
            <div className="relative w-full max-w-sm">
              {/* Ambient glow */}
              <div className="absolute inset-0 -z-10 bg-brand/10 rounded-3xl blur-2xl scale-110" />
              <HeroCardSwap />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
