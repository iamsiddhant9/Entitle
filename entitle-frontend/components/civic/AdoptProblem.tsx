import React from 'react'
import { Sparkles } from 'lucide-react'

export default function AdoptProblem() {
  return (
    <div className="py-20 px-6 sm:px-12 bg-green-500/5 border-y border-green-500/10">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <span className="text-[0.7rem] font-bold tracking-[3px] uppercase text-green-600 mb-3 block">
          Phase 3: The Closing Loop
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4 text-ink">
          Got your entitlement?<br />
          <em className="italic text-green-600 font-normal">Adopt a problem.</em>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-secondary max-w-2xl mx-auto font-light">
          When ENTITLE recovers your money, you can choose to donate a fraction of it to fix issues in your own neighborhood. We bypass the government entirely and fund local contractors to resolve the issue.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#1a2535] border border-green-500/15 p-6 sm:p-12 relative overflow-hidden rounded-lg shadow-xl">
        {/* Ribbon Cut Demo (Before / After) */}
        <div className="grid grid-cols-2 gap-1 mb-8 border border-green-500/15 overflow-hidden rounded-md">
          <div className="bg-orange-500/5 border-r border-green-500/15">
            <div className="text-[10px] tracking-[3px] uppercase text-center py-2 bg-orange-500/10 text-orange-500 border-b border-green-500/15">
              Before
            </div>
            <div className="h-32 flex items-center justify-center text-4xl relative">
              🗑️
              <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[2px] uppercase text-white/20 pointer-events-none">
                Slide to repair
              </div>
            </div>
          </div>
          <div className="bg-green-500/5">
            <div className="text-[10px] tracking-[3px] uppercase text-center py-2 bg-green-500/10 text-green-500 border-b border-green-500/15">
              After (Funded)
            </div>
            <div className="h-32 flex items-center justify-center text-4xl">
              🌳
            </div>
          </div>
        </div>

        {/* Plaque */}
        <div className="bg-gradient-to-br from-[#dbd0be]/10 to-[#dbd0be]/5 border border-[#dbd0be]/25 p-5 flex items-center gap-4 mb-8 relative overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#dbd0be]/5 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
          <div className="text-3xl shrink-0"><Sparkles className="w-8 h-8 text-[#dbd0be]" /></div>
          <div>
            <h4 className="font-bold tracking-tight text-lg text-[#E3F0FF] mb-1">Sitabuldi Market Cleanup</h4>
            <p className="text-xs text-white/45">Fully funded by 42 local residents using their recovered entitlements.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-3 bg-[#6d8fa3]/5 border-l-2 border-[#6d8fa3]/20">
            <div className="text-[10px] tracking-[2px] uppercase text-white/35 mb-1">Goal</div>
            <div className="text-sm text-white/85">₹15,000</div>
          </div>
          <div className="p-3 bg-[#6d8fa3]/5 border-l-2 border-[#6d8fa3]/20">
            <div className="text-[10px] tracking-[2px] uppercase text-white/35 mb-1">Contractor</div>
            <div className="text-sm text-white/85 text-brand underline cursor-pointer hover:text-white transition-colors">Verfied local NGO</div>
          </div>
          <div className="p-3 bg-[#6d8fa3]/5 border-l-2 border-[#6d8fa3]/20">
            <div className="text-[10px] tracking-[2px] uppercase text-white/35 mb-1">Status</div>
            <div className="text-sm text-green-500 font-semibold">100% Funded</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-6 bg-green-500/5 border border-green-500/10 rounded-md">
          <p className="text-sm text-white/50 mb-4">
            You just received ₹6,000 from PM-Kisan. Would you like to donate 5% to fix the broken streetlight on your street?
          </p>
          <button className="flex items-center mx-auto gap-2 bg-green-500 text-[#0B3D91] px-8 py-3 text-sm font-medium tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,183,136,0.3)] rounded">
            Donate ₹300 Automatically
          </button>
        </div>
      </div>
    </div>
  )
}
