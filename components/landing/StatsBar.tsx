const stats = [
  { value: '74', label: 'MBB THRESHOLD SCORE' },
  { value: '5', label: 'SKILLS ASSESSED' },
  { value: '40min', label: 'ASSESSMENT DURATION' },
  { value: '3', label: 'CAREER TRACKS' },
];

export default function StatsBar() {
  return (
    <section className="border-b border-[#e2e6ea]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-10 py-8 ${i < stats.length - 1 ? 'border-r border-[#e2e6ea]' : ''}`}
          >
            <div
              className="font-mono font-medium tabular-nums mb-1 text-[#051c2c]"
              style={{ fontSize: 'clamp(28px, 3vw, 38px)' }}
            >
              {stat.value}
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#8896a4] uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
