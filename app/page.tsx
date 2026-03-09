import Link from 'next/link';
import { trackCards } from '@/content/index';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-12 flex flex-col">
        {/* Brand */}
        <div className="mb-12">
          <span className="text-lg font-semibold text-neutral-900 tracking-tight">Vizon</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 leading-tight mb-3">
            Know where you stand.
          </h1>
          <p className="text-base text-neutral-500 leading-relaxed max-w-md">
            A structured diagnostic that evaluates the skills that actually matter for your career
            track — in 25–35 minutes.
          </p>
        </div>

        {/* Track cards */}
        <div className="space-y-3 mb-12">
          {trackCards.map((card) => (
            <Link
              key={card.trackId}
              href={`/diagnostic?track=${card.trackId}`}
              className="group block rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-neutral-900 mb-1">
                    {card.displayName}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                    {card.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 flex items-center justify-center transition-colors duration-150 mt-0.5">
                  <svg
                    className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors duration-150"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-neutral-400 text-center">
          No preparation required. Write freely. 3 cases · 5 questions each.
        </p>
      </div>
    </div>
  );
}
