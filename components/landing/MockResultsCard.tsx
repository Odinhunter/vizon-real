const skills = [
  { name: 'Structuring', score: 72, color: '#3b82f6' },
  { name: 'Hypothesis', score: 58, color: '#ef4444' },
  { name: 'Analytical', score: 81, color: '#10b981' },
  { name: 'Communication', score: 64, color: '#f59e0b' },
  { name: 'Decision', score: 69, color: '#3b82f6' },
];

export default function MockResultsCard() {
  return (
    <div className="w-full max-w-[360px] mx-auto h-full flex flex-col">
      <div className="bg-white/[0.18] backdrop-blur-2xl rounded-2xl border border-white/[0.25] overflow-hidden shadow-2xl shadow-black/40 flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.12] flex items-center justify-between">
          <p className="text-[10px] font-mono text-white/80 tracking-[0.15em] uppercase">
            Vizon · Consulting Track
          </p>
          <span className="text-[10px] font-mono px-3 py-1 bg-amber-500/30 text-amber-200 tracking-wider rounded-full font-medium">
            BORDERLINE
          </span>
        </div>

        {/* Score */}
        <div className="px-6 py-5 border-b border-white/[0.12]">
          <div className="flex items-baseline gap-2.5">
            <span className="text-5xl font-extrabold tabular-nums text-white">
              68
            </span>
            <span className="text-base font-medium text-white/65">/100</span>
            <span className="ml-auto font-mono text-[10px] text-white/75 tracking-wider">
              34th PERCENTILE
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/70 mt-1.5">
            6 pts below MBB threshold · 40 min assessment
          </p>
        </div>

        {/* Skill bars */}
        <div className="px-6 py-5 space-y-4 border-b border-white/[0.12] flex-1">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-white/90">{skill.name}</span>
                <span className="text-[12px] font-bold tabular-nums text-white">{skill.score}</span>
              </div>
              <div className="relative h-[5px] w-full bg-white/[0.15] rounded-full">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${skill.score}%`, backgroundColor: skill.color }}
                />
                <div
                  className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-[#e8521a]"
                  style={{ left: '74%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Priority rec */}
        <div className="px-6 py-4 bg-white/[0.06]">
          <p className="text-[10px] font-mono text-white/70 tracking-[0.12em] uppercase mb-1.5">
            Priority Focus
          </p>
          <p className="text-[12px] font-medium leading-snug text-white/90">
            Close the gap on Hypothesis Thinking and Decision-Making under time pressure.
          </p>
        </div>
      </div>
    </div>
  );
}
