import React from 'react'

export default function CivicFeed() {
  const feedItems = [
    {
      id: 1,
      status: 'Active',
      color: 'text-brand border-brand',
      title: 'Water pipe burst on Ring Road',
      meta: 'Reported 20 mins ago',
      supporters: '12 Residents watching'
    },
    {
      id: 2,
      status: 'Petition Fire',
      color: 'text-red-500 border-red-500',
      title: 'Mass Contamination: Ward 42',
      meta: 'Escalated 2 days ago',
      supporters: '741 Signatures'
    },
    {
      id: 3,
      status: 'Resolved',
      color: 'text-green-600 border-green-600',
      title: 'Broken Streetlights replaced',
      meta: 'Fixed by NMC yesterday',
      supporters: 'Verified by 4 residents'
    }
  ]

  return (
    <div className="py-20 px-6 sm:px-12 bg-surface-brand">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Live City Feed</h2>
        <p className="text-sm text-secondary mt-2">Real-time accountability tracking in Nagpur.</p>
      </div>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-px bg-brand/10 border border-brand/10">
        {feedItems.map(item => (
          <div key={item.id} className={`bg-white p-6 border-l-4 cursor-pointer transition-colors hover:bg-surface-brand ${item.color.split(' ')[1]}`}>
            <div className={`text-[10px] tracking-[2px] uppercase mb-2 flex items-center gap-1.5 ${item.color.split(' ')[0]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {item.status}
            </div>
            <h4 className="font-semibold text-sm mb-1 text-[#0B3D91]">{item.title}</h4>
            <div className="text-xs text-[#546E7A]">{item.meta}</div>
            <div className="mt-3 text-[11px] text-[#546E7A] font-medium">{item.supporters}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
