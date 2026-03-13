/**
 * Pressure Resilience Card — shows how performance changes across
 * 3 progressive case stages with a skill × case heatmap.
 */

const pressureData = [
  { skill: 'Structuring', scores: [82, 75, 61] },
  { skill: 'Hypothesis', scores: [65, 58, 52] },
  { skill: 'Analytical', scores: [78, 83, 86] },
  { skill: 'Communication', scores: [70, 64, 59] },
  { skill: 'Decision', scores: [72, 68, 66] },
];

function getHeatColor(score: number): string {
  if (score >= 80) return 'rgba(16, 185, 129, 0.70)';
  if (score >= 70) return 'rgba(59, 130, 246, 0.60)';
  if (score >= 60) return 'rgba(245, 158, 11, 0.55)';
  return 'rgba(239, 68, 68, 0.55)';
}

export default function MockTrajectoryCard() {
  const caseLabels = ['Case 1', 'Case 2', 'Case 3'];
  const overallByCase = [0, 1, 2].map((ci) => {
    const avg = pressureData.reduce((s, d) => s + d.scores[ci], 0) / pressureData.length;
    return Math.round(avg);
  });

  return (
    <div className="w-full max-w-[360px] mx-auto h-full flex flex-col">
      <div className="bg-white/[0.18] backdrop-blur-2xl rounded-2xl border border-white/[0.25] overflow-hidden shadow-2xl shadow-black/40 flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.12] flex items-center justify-between">
          <p className="text-[10px] font-mono text-white/80 tracking-[0.15em] uppercase">
            Vizon · Pressure Resilience
          </p>
          <span className="text-[9px] font-mono px-2.5 py-1 bg-red-500/30 text-red-300 tracking-wider rounded-full font-medium">
            DEGRADES
          </span>
        </div>

        {/* Overall trajectory */}
        <div className="px-6 py-5 border-b border-white/[0.12]">
          <div className="grid grid-cols-3 gap-4 text-center">
            {overallByCase.map((score, i) => (
              <div key={i}>
                <p className="text-[10px] font-mono text-white/75 mb-1">{caseLabels[i]}</p>
                <p className="text-[28px] font-extrabold tabular-nums text-white leading-none">{score}</p>
                <p className="text-[9px] text-white/65 mt-1">
                  {i === 0 ? 'Baseline' : i === 1 ? 'Escalation' : 'Pressure'}
                </p>
              </div>
            ))}
          </div>
          {/* Trend line */}
          <div className="mt-4 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.8), rgba(245,158,11,0.7), rgba(239,68,68,0.7))' }} />
        </div>

        {/* Skill × Case heatmap */}
        <div className="px-6 py-5 border-b border-white/[0.12] flex-1">
          <p className="text-[10px] font-mono text-white/70 tracking-[0.12em] uppercase mb-3.5">
            Skill × Case Heatmap
          </p>
          {/* Column headers */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1.5 mb-2">
            <div />
            {caseLabels.map((l) => (
              <p key={l} className="text-center text-[9px] font-mono text-white/65">{l}</p>
            ))}
          </div>
          {/* Rows */}
          <div className="space-y-1.5">
            {pressureData.map((d) => (
              <div key={d.skill} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1.5 items-center">
                <span className="text-[10px] font-medium text-white/85 truncate">{d.skill}</span>
                {d.scores.map((score, i) => (
                  <div
                    key={i}
                    className="h-[26px] rounded-md flex items-center justify-center"
                    style={{ backgroundColor: getHeatColor(score) }}
                  >
                    <span className="text-[10px] font-bold tabular-nums text-white">{score}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Resilience score */}
        <div className="px-6 py-4 bg-white/[0.06]">
          <p className="text-[10px] font-mono text-white/70 tracking-[0.12em] uppercase mb-1.5">
            Pressure Resilience
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-white/85">
              Drops <span className="text-red-400 font-semibold">-14pts</span> under pressure
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold tabular-nums text-white">41</span>
              <span className="text-[11px] text-white/60">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
