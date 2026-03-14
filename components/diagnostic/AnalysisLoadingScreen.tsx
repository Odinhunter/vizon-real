'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  'Analysing your diagnostic',
  'Evaluating 5 core skills',
  'Comparing against benchmarks',
  'Generating personalized insights',
  'Preparing your report',
  'Almost there...',
];

export default function AnalysisLoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="h-12 bg-[#0A0A0A] flex items-center px-6 shrink-0">
        <span className="text-white text-xs font-mono tracking-widest">VIZON</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-5">
        {/* Sliding blue bar */}
        <div className="w-48 h-px bg-neutral-100 relative overflow-hidden">
          <div className="absolute inset-y-0 w-24 bg-[#1A56DB] animate-[slide_1.5s_ease-in-out_infinite]" />
        </div>

        <div className="text-center space-y-3">
          <p
            className={`font-mono text-sm text-neutral-900 tracking-wider uppercase transition-opacity duration-400 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {MESSAGES[messageIndex]}
          </p>
          <p className="font-mono text-xs text-neutral-500">
            Reviewing 15 responses · 30–60 seconds
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === messageIndex
                  ? 'bg-[#1A56DB] scale-125'
                  : i < messageIndex
                    ? 'bg-neutral-300'
                    : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
