'use client';

interface ProgressIndicatorProps {
  caseNumber: 1 | 2 | 3;
  probeNumber: number;
  totalProbes: number;
}

const TOTAL_CASES = 3;

export default function ProgressIndicator({
  caseNumber,
  probeNumber,
  totalProbes,
}: ProgressIndicatorProps) {
  const completedProbes = (caseNumber - 1) * totalProbes + (probeNumber - 1);
  const totalSessionProbes = TOTAL_CASES * totalProbes;
  const progressPct = Math.round((completedProbes / totalSessionProbes) * 100);

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600">
          Case {caseNumber} of {TOTAL_CASES}
          <span className="mx-2 text-neutral-400">·</span>
          Question {probeNumber} of {totalProbes}
        </span>
        <span className="text-sm text-neutral-500">{progressPct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Case dots */}
      <div className="flex gap-1.5 mt-2.5">
        {Array.from({ length: TOTAL_CASES }, (_, i) => {
          const caseIdx = i + 1;
          const isComplete = caseIdx < caseNumber;
          const isActive = caseIdx === caseNumber;
          return (
            <div
              key={caseIdx}
              className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
                isComplete
                  ? 'bg-neutral-900'
                  : isActive
                    ? 'bg-neutral-400'
                    : 'bg-neutral-100'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
