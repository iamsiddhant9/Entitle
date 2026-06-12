import React, { useState, useEffect } from 'react'
import { X, Camera, ScanLine, MapPin, UploadCloud, CheckCircle2 } from 'lucide-react'
import type { CivicIssue } from './IssueFeed'

interface ReportIssueModalProps {
  onClose: () => void
  onReported: (issue: CivicIssue) => void
}

export default function ReportIssueModal({ onClose, onReported }: ReportIssueModalProps) {
  const [step, setStep] = useState<'upload' | 'scanning' | 'details'>('upload')
  const [photo, setPhoto] = useState<string | null>(null)

  // AI categorization results
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('medium')
  const [location, setLocation] = useState('')

  const handleUpload = () => {
    // Mocking an image upload by using a generic pothole image
    setPhoto('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400')
    setStep('scanning')
  }

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => {
        setCategory('Road Infrastructure / Pothole')
        setSeverity('high')
        setLocation('Ward 44, Dharampeth, Nagpur')
        setStep('details')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleSubmit = () => {
    const newIssue: CivicIssue = {
      id: `ISS-${Math.floor(Math.random() * 1000)}`,
      title: 'Dangerous Pothole detected',
      category: 'Road Infrastructure',
      location: location || 'Nagpur, MH',
      status: 'filing', // Transition immediately to filing phase
      timeAgo: 'Just now',
      severity,
      imageUrl: photo || undefined
    }
    onReported(newIssue)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-ink">Report a Civic Issue</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-border transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'upload' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-surface-brand rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/20">
                <Camera className="w-8 h-8 text-brand" />
              </div>
              <h4 className="font-semibold text-ink">Take a photo of the issue</h4>
              <p className="text-sm text-secondary px-4">
                Our AI will automatically extract the location, severity, and category from your photo and GPS metadata.
              </p>
              <button
                onClick={handleUpload}
                className="mt-6 w-full py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-5 h-5" />
                Upload Photo
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <div className="text-center space-y-6 py-4">
              <div className="relative w-48 h-32 mx-auto rounded-xl overflow-hidden bg-muted/20 border border-border">
                {photo && <img src={photo} alt="Upload" className="w-full h-full object-cover" />}
                {/* Scanline overlay */}
                <div className="absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_8px_2px_rgba(11,92,255,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-brand font-semibold text-sm">
                  <ScanLine className="w-4 h-4 animate-spin-slow" />
                  Analyzing image & metadata...
                </div>
                <p className="text-xs text-muted font-mono">Extracting GPS coordinates and categorizing issue type.</p>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-5 animate-fadeUp">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg text-sm font-semibold border border-green-200">
                <CheckCircle2 className="w-4 h-4" />
                AI Categorization Complete
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Detected Category</span>
                  <div className="text-sm font-medium text-ink bg-surface-brand/50 px-3 py-2 rounded-lg border border-border">
                    {category}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Location Info (GPS)</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink bg-surface-brand/50 px-3 py-2 rounded-lg border border-border">
                    <MapPin className="w-4 h-4 text-brand" />
                    {location}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Assessed Severity</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    High Priority
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-ink text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate Grievance Draft →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
