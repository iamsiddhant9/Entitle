'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import DetectiveBoard from '@/components/civic/DetectiveBoard'
import PetitionEngine from '@/components/civic/PetitionEngine'
import AdoptProblem from '@/components/civic/AdoptProblem'
import CivicFeed from '@/components/civic/CivicFeed'
import IssueFeed from '@/components/civic/IssueFeed'
import ReportIssueModal from '@/components/civic/ReportIssueModal'

export default function CivicPage() {
  const [isReporting, setIsReporting] = useState(false)

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-ink tracking-tight">entitle</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-brand font-semibold text-sm ml-2 px-2 py-0.5 bg-brand/10 rounded">Civic Pulse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-secondary hover:text-ink transition-colors">
              Back to Home
            </Link>
            <button 
              onClick={() => setIsReporting(true)}
              className="bg-brand text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Report Issue
            </button>
          </div>
        </div>
      </header>

      {/* The 4 HTML-extracted components */}
      <DetectiveBoard />
      <PetitionEngine />
      <AdoptProblem />
      <CivicFeed />

      {/* Existing Feed where users can report things */}
      <div className="py-20 px-6 sm:px-12 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-ink mb-8 text-center">Local Issue Tracking</h2>
          <IssueFeed isReporting={isReporting} setIsReporting={setIsReporting} />
        </div>
      </div>

      {isReporting && <ReportIssueModal onClose={() => setIsReporting(false)} />}
    </main>
  )
}
