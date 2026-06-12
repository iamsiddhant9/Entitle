'use client'
import React, { useState, useEffect } from 'react'
import { ShieldCheck, Clock, Link2, CheckCircle2 } from 'lucide-react'

/* ── Mock certificate ─────────────────────────────────────────── */
function CertificateCard() {
  const [ts] = useState(() => new Date())
  const blockNo = 48_291_033 + Math.floor(Math.random() * 1000)

  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-2xl scale-110 pointer-events-none" />

      <div className="relative border border-purple-400/30 bg-gradient-to-br from-[#1a1040] via-surface to-[#0f1a35] rounded-3xl p-6 shadow-2xl">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-purple-400">ENTITLE Protocol</div>
              <div className="text-xs font-bold text-ink">Entitlement Certificate</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-purple-400/15 text-purple-300 text-[9px] font-bold px-2.5 py-1 rounded-full border border-purple-400/20">
            <CheckCircle2 className="w-3 h-3" />
            Verified On-chain
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-5" />

        {/* Details */}
        <div className="space-y-3 mb-5">
          <DetailRow label="Scheme" value="PM Kisan Samman Nidhi" highlight />
          <DetailRow label="Eligible Amount" value="₹6,000 / year" highlight />
          <DetailRow label="Beneficiary Hash" value="0x3f8a…d92c" mono />
          <DetailRow label="Block Number" value={`#${blockNo.toLocaleString('en-IN')}`} mono />
          <DetailRow label="Network" value="Polygon PoS" />
          <DetailRow label="Timestamp" value={ts.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} mono small />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-muted">
            <Clock className="w-3 h-3" />
            Immutable · Cannot be altered
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            onClick={e => e.preventDefault()}
          >
            <Link2 className="w-3 h-3" />
            Verify on Polygonscan →
          </a>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label, value, mono = false, highlight = false, small = false,
}: { label: string; value: string; mono?: boolean; highlight?: boolean; small?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[10px] text-muted uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-right ${mono ? 'font-mono' : 'font-semibold'} ${highlight ? 'text-brand' : 'text-ink'} ${small ? 'text-[9px]' : 'text-xs'}`}>
        {value}
      </span>
    </div>
  )
}

/* ── Timeline step ────────────────────────────────────────────── */
function TimelineStep({ icon, title, body, active = false }: {
  icon: string; title: string; body: string; active?: boolean
}) {
  return (
    <div className={`flex gap-4 ${active ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${active ? 'bg-purple-500/20 border-purple-400/40' : 'bg-surface border-border'}`}>
          {icon}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-6">
        <div className={`text-sm font-bold ${active ? 'text-ink' : 'text-secondary'} mb-1`}>{title}</div>
        <div className="text-xs text-muted leading-relaxed">{body}</div>
      </div>
    </div>
  )
}

/* ── Main section ─────────────────────────────────────────────── */
export default function ProofOfEntitlement() {
  const [activeStep, setActiveStep] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setActiveStep(s => (s + 1) % 3), 2500)
    return () => clearInterval(iv)
  }, [])

  return (
    <section id="proof" className="py-24 bg-background relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-400/20">
            Blockchain · Polygon PoS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-4">
            Proof of Entitlement
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            When ENTITLE confirms your eligibility, it issues a <span className="text-purple-400 font-semibold">tamper-proof, timestamped record</span> on the Polygon blockchain. Your rights, permanently on-chain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: certificate */}
          <CertificateCard />

          {/* Right: explanation */}
          <div>
            <h3 className="text-2xl font-bold text-ink mb-3">
              Corruption-resistance at the last mile
            </h3>
            <p className="text-secondary leading-relaxed mb-8">
              India loses billions annually to disputed entitlements — officials deny eligibility, records go missing, and vulnerable citizens have no recourse. ENTITLE fixes this with an auditable, immutable trail.
            </p>

            {/* Timeline */}
            <div>
              {[
                {
                  icon: '🔍',
                  title: 'AI finds you eligible',
                  body: 'ENTITLE scans 1,200+ schemes and satellite data to determine your exact eligibility profile.',
                },
                {
                  icon: '🔗',
                  title: 'Record timestamped on Polygon',
                  body: 'Your eligibility is hashed and written to Polygon PoS — free, instant, and permanent. Block hash is yours forever.',
                },
                {
                  icon: '🛡️',
                  title: 'Dispute-proof forever',
                  body: 'If any official questions your eligibility, you show the on-chain timestamp. The blockchain doesn\'t lie.',
                },
              ].map((s, i) => (
                <TimelineStep key={i} {...s} active={activeStep === i} />
              ))}
            </div>

            {/* Value props */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { icon: '⚡', label: 'Instant issuance', sub: 'No waiting, no cost' },
                { icon: '🔒', label: 'Immutable record', sub: 'Cannot be altered' },
                { icon: '🌐', label: 'Publicly verifiable', sub: 'Anyone can check' },
                { icon: '₹0', label: 'Free forever', sub: 'Polygon gas = fractions' },
              ].map(p => (
                <div key={p.label} className="bg-surface border border-border rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-ink">{p.label}</div>
                    <div className="text-[10px] text-muted">{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
