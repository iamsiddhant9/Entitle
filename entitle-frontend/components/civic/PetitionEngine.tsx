import React from 'react'
import { Flame, Clock, Users } from 'lucide-react'

export default function PetitionEngine() {
  return (
    <div className="py-20 px-6 sm:px-12 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Fire Card */}
        <div className="bg-[#1a2535] border border-red-500/15 p-8 relative overflow-hidden transition-shadow duration-1000 hover:shadow-[inset_0_0_40px_rgba(220,38,38,0.15)] rounded-lg">
          {/* Fire Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1.5 text-xs tracking-[2px] uppercase mb-6">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            Class Action Escalation
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Mass Contamination: Ward 42 Water Supply</h3>
          <p className="text-sm text-white/50 leading-relaxed mb-6">
            The deadline for official resolution has passed. ENTITLE has automatically escalated this grievance into a community petition to force immediate action.
          </p>

          <div className="bg-red-500/5 border border-red-500/15 p-4 mb-6">
            <span className="text-[10px] tracking-[3px] uppercase text-red-500 mb-1.5 block">
              Legal Escalation Timer
            </span>
            <div className="font-mono text-3xl text-red-400 tracking-[4px]">
              03:14:22:09
            </div>
          </div>

          <div className="h-2 bg-red-500/10 border border-red-500/15 mb-5 overflow-hidden">
            <div className="h-full w-[71%] bg-gradient-to-r from-red-500/50 to-red-500 rounded-sm" />
          </div>

          <div className="flex items-center gap-0 mb-6">
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#1a2535] bg-brand flex items-center justify-center text-[10px] text-white">JD</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#1a2535] bg-brand-dark flex items-center justify-center text-[10px] text-white">MK</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#1a2535] bg-blue-500 flex items-center justify-center text-[10px] text-white">AS</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#1a2535] bg-blue-700 flex items-center justify-center text-[10px] text-white">PR</div>
            </div>
            <span className="text-xs text-white/50 ml-3">741 Residents have signed</span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 py-3.5 text-sm font-semibold tracking-wide transition-all hover:bg-red-500/30 hover:-translate-y-px">
            <Users className="w-4 h-4" />
            Join the Petition
          </button>
        </div>

        {/* Right: Info */}
        <div>
          <span className="text-[0.7rem] font-bold tracking-[3px] uppercase text-brand mb-3 block">
            Phase 2: Civic Issue Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4 text-ink">
            When the system stalls,<br />
            <em className="italic text-brand font-normal">the community escalates.</em>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-secondary mb-8 font-light">
            ENTITLE tracks the legal SLA deadline for every grievance. If the municipal corporation fails to act in time, the agent automatically converts your single complaint into a mass public petition.
          </p>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <Clock className="w-6 h-6 text-brand shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-ink mb-1">SLA Deadline Tracking</h4>
                <p className="text-xs text-secondary leading-relaxed">The agent monitors the Right to Public Services Act deadlines. 30 days passed? The agent acts.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Flame className="w-6 h-6 text-brand shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-ink mb-1">Automated Escalation</h4>
                <p className="text-xs text-secondary leading-relaxed">No manual follow-ups required. The system automatically drafts and serves legal notices to higher authorities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
