'use client'
import React, { useState } from 'react'
import type { CivicProfile } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

interface ProfilePanelProps {
  profile: CivicProfile
  onSave?: (data: Partial<CivicProfile>) => Promise<CivicProfile | undefined>
}

const casteOptions = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'nt_dnt', label: 'NT/DNT' },
]

const occupationOptions = [
  { value: 'farmer', label: 'Farmer' },
  { value: 'labourer', label: 'Labourer' },
  { value: 'skilled_trade', label: 'Skilled Trade' },
  { value: 'small_business', label: 'Small Business' },
  { value: 'salaried', label: 'Salaried' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'other', label: 'Other' },
]

export default function ProfilePanel({ profile, onSave }: ProfilePanelProps) {
  const [form, setForm] = useState({ ...profile })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (key: keyof CivicProfile, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!onSave) return
    setSaving(true)
    try {
      await onSave(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all'
  const labelClass = 'block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5'

  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-ink mb-6">My Profile</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Age */}
        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            value={form.age}
            onChange={e => update('age', Number(e.target.value))}
            className={inputClass}
          />
        </div>

        {/* State */}
        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            value={form.state}
            onChange={e => update('state', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* District */}
        <div>
          <label className={labelClass}>District</label>
          <input
            type="text"
            value={form.district}
            onChange={e => update('district', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Caste category */}
        <div>
          <label className={labelClass}>Caste Category</label>
          <select
            value={form.casteCategory}
            onChange={e => update('casteCategory', e.target.value)}
            className={inputClass}
          >
            {casteOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className={labelClass}>Occupation</label>
          <select
            value={form.occupation}
            onChange={e => update('occupation', e.target.value)}
            className={inputClass}
          >
            {occupationOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label className={labelClass}>Annual Income (₹)</label>
          <input
            type="number"
            value={form.annualIncome}
            onChange={e => update('annualIncome', Number(e.target.value))}
            className={inputClass}
          />
        </div>

        {/* Family size */}
        <div>
          <label className={labelClass}>Family Size</label>
          <input
            type="number"
            value={form.familySize}
            onChange={e => update('familySize', Number(e.target.value))}
            className={inputClass}
            min={1}
          />
        </div>

        {/* Land holding */}
        <div>
          <label className={labelClass}>Land Holding (acres, optional)</label>
          <input
            type="number"
            value={form.landHolding ?? ''}
            onChange={e => update('landHolding', e.target.value ? Number(e.target.value) : undefined)}
            className={inputClass}
            placeholder="0"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="mt-5 grid md:grid-cols-3 gap-4">
        {[
          { key: 'bplCard' as const, label: 'BPL Card' },
          { key: 'aadhaarLinked' as const, label: 'Aadhaar Linked' },
          { key: 'panLinked' as const, label: 'PAN Linked' },
        ].map(toggle => (
          <label key={toggle.key} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => update(toggle.key, !form[toggle.key])}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                form[toggle.key] ? 'bg-brand' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  form[toggle.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-secondary group-hover:text-ink transition-colors">{toggle.label}</span>
          </label>
        ))}
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !onSave}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-brand">
            <Check className="w-4 h-4" /> Saved!
          </div>
        )}
      </div>
    </div>
  )
}
