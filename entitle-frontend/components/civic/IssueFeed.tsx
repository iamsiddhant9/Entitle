import React, { useState } from 'react'
import { MapPin, AlertCircle, Clock, Camera } from 'lucide-react'
import ReportIssueModal from './ReportIssueModal'
import AgenticFilingView from './AgenticFilingView'

export type CivicIssue = {
  id: string
  title: string
  category: string
  location: string
  status: 'reported' | 'filing' | 'submitted' | 'resolved'
  timeAgo: string
  severity: 'high' | 'medium' | 'low'
  imageUrl?: string
}

const MOCK_ISSUES: CivicIssue[] = [
  {
    id: 'ISS-001',
    title: 'Severe Pothole on Main Road',
    category: 'Road Infrastructure',
    location: 'Dharampeth, Nagpur',
    status: 'submitted',
    timeAgo: '2 hours ago',
    severity: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ISS-002',
    title: 'Overflowing Garbage Dump',
    category: 'Sanitation',
    location: 'Sitabuldi, Nagpur',
    status: 'reported',
    timeAgo: '5 hours ago',
    severity: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a1d81f21?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ISS-003',
    title: 'Broken Streetlight',
    category: 'Public Safety',
    location: 'Sadar, Nagpur',
    status: 'resolved',
    timeAgo: '1 day ago',
    severity: 'low',
  }
]

export default function IssueFeed() {
  const [issues, setIssues] = useState<CivicIssue[]>(MOCK_ISSUES)
  const [isReporting, setIsReporting] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)

  const handleIssueReported = (newIssue: CivicIssue) => {
    setIssues([newIssue, ...issues])
    setIsReporting(false)
    setSelectedIssue(newIssue) // Automatically open filing view for demo purposes
  }

  if (selectedIssue && selectedIssue.status === 'filing') {
    return (
      <AgenticFilingView 
        issue={selectedIssue} 
        onClose={() => {
          setSelectedIssue(null)
          setIssues(issues.map(i => i.id === selectedIssue.id ? { ...i, status: 'submitted' } : i))
        }} 
      />
    )
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Header and Action */}
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 bg-gradient-to-br from-brand/5 to-accent/5 p-5 rounded-2xl border border-brand/10">
        <div>
          <h2 className="text-lg font-bold text-ink">Civic Repair Engine</h2>
          <p className="text-sm text-secondary">Report local issues. We&apos;ll force accountability.</p>
        </div>
        <button
          onClick={() => setIsReporting(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-all duration-150 shadow-md"
        >
          <Camera className="w-4 h-4" />
          Report an Issue
        </button>
      </div>

      {/* Grid Feed */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-brand/30 transition-colors shadow-sm group">
            {issue.imageUrl ? (
              <div className="h-32 w-full bg-muted/20 relative">
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-ink">
                  {issue.category}
                </div>
              </div>
            ) : (
              <div className="h-32 w-full bg-surface-brand flex items-center justify-center border-b border-border">
                <AlertCircle className="w-8 h-8 text-brand/40" />
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${
                  issue.severity === 'high' ? 'bg-red-500' :
                  issue.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                  {issue.status}
                </span>
              </div>
              <h3 className="font-semibold text-ink text-sm mb-1 leading-snug line-clamp-2">
                {issue.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-secondary mt-3">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{issue.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{issue.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isReporting && (
        <ReportIssueModal 
          onClose={() => setIsReporting(false)} 
          onReported={handleIssueReported}
        />
      )}
    </div>
  )
}
