const stats = [
  { value: '74', label: 'MBB THRESHOLD SCORE' },
  { value: '5', label: 'SKILLS ASSESSED' },
  { value: '40min', label: 'ASSESSMENT DURATION' },
  { value: '61%', label: 'SCORE BELOW MBB THRESHOLD' },
];

export default function StatsBar() {
  return (
    <section className="border-b border-[#e2e6ea]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          // On 2-col mobile: items 0,2 are left col (get border-r), items 1,3 are right col (no border-r)
          // On 4-col desktop: all except last get border-r
          const isRightColMobile = i % 2 === 1;
          const isLast = i === stats.length - 1;

          return (
            <div
              key={stat.label}
              className={`px-5 md:px-10 py-5 md:py-8 ${
                isRightColMobile
                  ? isLast ? '' : 'lg:border-r lg:border-[#e2e6ea]'
                  : 'border-r border-[#e2e6ea]'
              } ${i < 2 ? 'border-b border-[#e2e6ea] lg:border-b-0' : ''}`}
            >
              <div
                className="font-mono font-medium tabular-nums mb-1 text-[#051c2c]"
                style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-[#8896a4] uppercase">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
