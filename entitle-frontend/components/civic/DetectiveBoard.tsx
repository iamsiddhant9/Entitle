import React from 'react'

export default function DetectiveBoard() {
  return (
    <div className="py-20 px-6 sm:px-12 bg-surface border-y border-border relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(11,92,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <span className="text-[0.7rem] font-bold tracking-[3px] uppercase text-brand mb-3 block">
          Phase 1: Rights Engine
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-2 text-ink">
          What&apos;s Owed To You.<br />
          <em className="italic text-brand font-normal">Identified Instantly.</em>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-secondary max-w-2xl mb-12 font-light">
          ENTITLE acts as your personal civic detective. It scans your profile against thousands of schemes and public records, building a complete &quot;case file&quot; of exactly what the government owes you.
        </p>

        {/* Detective Board UI */}
        <div className="bg-[#1a2535] border border-brand/20 p-6 sm:p-10 relative rounded-lg shadow-2xl transform rotate-0 hover:rotate-1 transition-transform duration-500">
          <div className="absolute -top-3 left-8 bg-brand text-white text-xs font-semibold tracking-widest px-3 py-1 shadow-sm">
            CASE FILE: ACTIVE
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Photo Evidence */}
            <div className="shrink-0 relative">
              <div className="w-48 h-36 bg-gradient-to-br from-[#243040] to-[#1a2535] border-2 border-brand/20 flex flex-col items-center justify-center transform rotate-2 relative shadow-lg overflow-hidden">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-4 bg-red-500/80 [clip-path:polygon(50%_0,100%_100%,0_100%)] shadow-sm z-10" />
                {/* Actual Evidence Image */}
                <img 
                  src="/images/civic/document.png" 
                  alt="Verified Evidence" 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-300"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-white/90 font-bold uppercase z-10 bg-black/50 px-2 py-0.5 rounded">
                  Digital Footprint
                </span>
              </div>
              {/* String line */}
              <div className="hidden md:block absolute top-6 left-48 right-0 w-32 h-px bg-brand/40 origin-left transform rotate-12" />
            </div>

            {/* Right: Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-white">Pradhan Mantri Awas Yojana</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-xs tracking-wide rounded border border-brand text-brand/90 bg-brand/10">
                  HOUSING DEPT
                </span>
                <span className="px-3 py-1 text-xs tracking-wide rounded border border-white/20 text-white/80 bg-white/5">
                  PAN VERIFIED
                </span>
                <span className="px-3 py-1 text-xs tracking-wide rounded border border-green-500/50 text-green-400 bg-green-500/10">
                  98% MATCH
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Based on your income parameters and geographic location, you are legally entitled to a housing subsidy of up to ₹2.5 Lakhs under PMAY-U. All required verification documents are already present in your Entitle vault.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-brand/5 border-l-2 border-brand/40">
                  <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Estimated Value</div>
                  <div className="text-sm text-white/90 font-mono">₹2,50,000</div>
                </div>
                <div className="p-3 bg-brand/5 border-l-2 border-brand/40">
                  <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Required Action</div>
                  <div className="text-sm text-white/90">Autonomous Submission</div>
                </div>
              </div>

              <button className="mt-8 px-6 py-3 bg-brand text-white text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,92,255,0.35)] flex items-center gap-2">
                Generate Application Draft
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
