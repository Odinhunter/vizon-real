/**
 * Candidate Archetype Card — personality-type classification
 * based on skill distribution.
 */

const traits = [
  { label: 'Structuring', value: 85, peak: true },
  { label: 'Clarity', value: 81, peak: true },
  { label: 'Prioritisation', value: 70, peak: false },
  { label: 'Speed', value: 69, peak: false },
  { label: 'Pressure', value: 52, peak: false },
];

const firmFit = [
  { firm: 'McKinsey', fit: 74, color: '#60a5fa' },
  { firm: 'BCG', fit: 61, color: '#a78bfa' },
  { firm: 'Bain', fit: 58, color: '#f87171' },
];

export default function MockFrameworkCard() {
  return (
    <div className="w-full max-w-[360px] mx-auto h-full flex flex-col">
      <div className="bg-white/[0.18] backdrop-blur-2xl rounded-2xl border border-white/[0.25] overflow-hidden shadow-2xl shadow-black/40 flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.12]">
          <p className="text-[10px] font-mono text-white/80 tracking-[0.15em] uppercase">
            Vizon · Candidate Archetype
          </p>
        </div>

        {/* Archetype */}
        <div className="px-6 py-5 border-b border-white/[0.12]">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#1A56DB]/40 border border-[#1A56DB]/50 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <div>
              <p className="text-[18px] font-bold text-white leading-tight">The Structured Analyst</p>
              <p className="text-[10px] text-white/70 font-mono tracking-wide mt-0.5">ARCHETYPE · TOP 15% STRUCTURERS</p>
            </div>
          </div>
          <p className="text-[12px] text-white/85 leading-relaxed">
            Strong at decomposing complex problems into clean frameworks. Clarity is a natural strength — but pressure tolerance needs work.
          </p>
        </div>

        {/* Trait bars */}
        <div className="px-6 py-5 border-b border-white/[0.12] flex-1">
          <p className="text-[10px] font-mono text-white/70 tracking-[0.12em] uppercase mb-3.5">
            Trait Profile
          </p>
          <div className="space-y-3">
            {traits.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-white/85 w-[80px] shrink-0">{t.label}</span>
                <div className="flex-1 h-[5px] bg-white/[0.15] rounded-full relative">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${t.value}%`,
                      background: t.peak
                        ? 'linear-gradient(90deg, #1A56DB, #60a5fa)'
                        : 'rgba(255,255,255,0.45)',
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold tabular-nums text-white w-7 text-right">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MBB Firm Fit */}
        <div className="px-6 py-4 bg-white/[0.06]">
          <p className="text-[10px] font-mono text-white/70 tracking-[0.12em] uppercase mb-2.5">
            MBB Firm Fit
          </p>
          <div className="flex items-center gap-5">
            {firmFit.map((f) => (
              <div key={f.firm} className="flex items-center gap-2">
                <span className="text-[11px] text-white/85 font-medium">{f.firm}</span>
                <span
                  className="text-[13px] font-bold tabular-nums"
                  style={{ color: f.color }}
                >
                  {f.fit}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
