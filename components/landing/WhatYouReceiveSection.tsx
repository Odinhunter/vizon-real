import SectionLabel from './SectionLabel';

const deliverables = [
  {
    title: 'Overall Verdict + Score',
    description:
      'A single composite score benchmarked against the MBB threshold, with a clear verdict on your readiness level.',
  },
  {
    title: '5-Skill Capability Map',
    description:
      'Individual scores for each core skill — with benchmarks, gap analysis, and trajectory across case stages.',
  },
  {
    title: 'Evidence From Your Answers',
    description:
      'Behavioral signals extracted from how you write — confidence, structure, precision — not just what you said.',
  },
  {
    title: 'Priority Recommendation',
    description:
      'Targeted guidance on which skill to focus on next, based on your weakest dimension relative to the benchmark.',
  },
];

export default function WhatYouReceiveSection() {
  return (
    <section className="px-10 py-16 border-b border-[#e2e6ea]">
      <SectionLabel label="WHAT YOU RECEIVE" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e2e6ea] border border-[#e2e6ea]">
        {deliverables.map((item, i) => (
          <div
            key={item.title}
            className="bg-white py-7 px-6"
          >
            <span className="font-mono text-[11px] text-[#dce3e8] mb-3 block">
              0{i + 1}
            </span>
            <h3 className="font-mono text-[14px] font-medium text-[#051c2c] mb-3">
              {item.title}
            </h3>
            <p className="font-mono text-[11px] text-[#4a5568] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
