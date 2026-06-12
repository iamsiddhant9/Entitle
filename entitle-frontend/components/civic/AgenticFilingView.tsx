import React, { useState, useEffect } from 'react'
import { FileText, Send, Building2, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react'
import type { CivicIssue } from './IssueFeed'

interface AgenticFilingViewProps {
  issue: CivicIssue
  onClose: () => void
}

export default function AgenticFilingView({ issue, onClose }: AgenticFilingViewProps) {
  const [submissionState, setSubmissionState] = useState<'idle' | 'drafting' | 'submitting' | 'success'>('idle')

  useEffect(() => {
    // Simulate initial drafting state automatically for a nice UX flow
    setSubmissionState('drafting')
    const t = setTimeout(() => setSubmissionState('idle'), 1500)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = () => {
    setSubmissionState('submitting')
    setTimeout(() => {
      setSubmissionState('success')
    }, 3000)
  }

  const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 hover:bg-border rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-secondary" />
          </button>
          <div>
            <h2 className="font-bold text-ink">Agentic Filing: Grievance</h2>
            <p className="text-xs text-secondary">Case ID: {issue.id}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-border">
        {/* Left Side: Context & Target Authority */}
        <div className="bg-surface p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Target Authority Identified</h3>
            <div className="bg-surface-brand/30 border border-brand/20 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-brand/10 rounded-lg shrink-0 mt-0.5">
                <Building2 className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="font-bold text-ink text-sm">Nagpur Municipal Corporation (NMC)</div>
                <div className="text-xs text-secondary mt-0.5">Public Works Department, Dharampeth Zone</div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-brand/10 text-brand px-2 py-0.5 rounded mt-2">
                  Channel: Grievance Portal API
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Attached Evidence</h3>
            {issue.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden h-40 border border-border">
                <img src={issue.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono flex flex-col">
                  <span>GPS: 21.1458° N, 79.0882° E</span>
                  <span>Time: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>
            ) : (
              <div className="h-24 bg-muted/20 rounded-xl flex items-center justify-center border border-border">
                <span className="text-sm text-secondary">No photo attached</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Generated Document & Action */}
        <div className="bg-surface p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Auto-Generated Draft</h3>
            {submissionState === 'drafting' && <Loader2 className="w-4 h-4 text-brand animate-spin" />}
          </div>

          <div className={`flex-1 bg-[#fbfbfe] border border-border rounded-xl p-5 font-mono text-sm text-ink leading-relaxed shadow-inner overflow-y-auto ${submissionState === 'drafting' ? 'opacity-50 blur-[1px]' : ''}`}>
            <p className="mb-4">
              <strong>To:</strong><br />
              The Zonal Officer, PWD<br />
              Nagpur Municipal Corporation<br />
              Dharampeth Zone, Nagpur, MH
            </p>
            <p className="mb-4"><strong>Date:</strong> {currentDate}</p>
            <p className="mb-4 font-bold underline">Subject: Formal Grievance regarding {issue.title.toLowerCase()} at {issue.location}.</p>
            <p className="mb-4">Respected Sir/Madam,</p>
            <p className="mb-4">
              Under Section 284 of the City of Nagpur Corporation Act, 1948, it is the statutory duty of the Corporation to maintain public streets in a state of repair. 
            </p>
            <p className="mb-4">
              I am writing to formally report a {issue.severity} severity issue categorized as &quot;{issue.category}&quot; at {issue.location} (Coordinates attached). This poses an immediate hazard to public safety and smooth traffic flow.
            </p>
            <p className="mb-4">
              Please find the geotagged photographic evidence attached. I request you to register this grievance and initiate repair work within the SLA prescribed under the Right to Public Services Act.
            </p>
            <p>Sincerely,</p>
            <p>[Resident / User Name]</p>
          </div>

          <div className="mt-6">
            {submissionState === 'idle' && (
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-semibold hover:bg-brand-dark transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Grievance Autonomously
              </button>
            )}

            {submissionState === 'submitting' && (
              <div className="w-full py-3.5 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-brand animate-spin" />
                <span className="font-semibold text-brand">Agent navigating NMC portal...</span>
              </div>
            )}

            {submissionState === 'success' && (
              <div className="w-full py-4 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  Successfully Filed!
                </div>
                <p className="text-xs text-green-600 font-medium text-center">
                  Tracking ID: NMC-GRV-2026-{Math.floor(Math.random() * 90000) + 10000}
                </p>
                <button onClick={onClose} className="mt-2 text-sm text-green-700 underline underline-offset-2 hover:text-green-800">
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
