'use client';

import { useState, useCallback } from 'react';
import type { ProbeStep, DiagnosticResultData } from '@/lib/api/diagnosticClient';
import { startSession, submitAnswer } from '@/lib/api/diagnosticClient';
import { getCaseContent, getProbeContent, getTrackIntro } from '@/content/index';
import DiagnosticIntro from './DiagnosticIntro';
import CaseIntro from './CaseIntro';
import ProbeDisplay from './ProbeDisplay';
import DiagnosticResults from './DiagnosticResults';

interface DiagnosticControllerProps {
  trackId: string;
}

type Phase = 'intro' | 'case_intro' | 'probe' | 'results';

const TOTAL_PROBES = 5;

export default function DiagnosticController({ trackId }: DiagnosticControllerProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [caseNumber, setCaseNumber] = useState<1 | 2 | 3>(1);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [probeNumber, setProbeNumber] = useState(1);

  // Step buffering: pendingStep is shown after case_intro, activeStep is the live probe
  const [pendingStep, setPendingStep] = useState<ProbeStep | null>(null);
  const [activeStep, setActiveStep] = useState<ProbeStep | null>(null);

  // Answer input
  const [answer, setAnswer] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(undefined);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  // Results
  const [result, setResult] = useState<DiagnosticResultData | null>(null);

  // ── Content lookups ────────────────────────────────────────────────────────

  const trackIntro = getTrackIntro(trackId);
  const caseContent = currentCaseId ? getCaseContent(currentCaseId) : null;
  const probeContent =
    activeStep?.variantId ? getProbeContent(activeStep.variantId) : null;

  // ── Transitions ────────────────────────────────────────────────────────────

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const resp = await startSession(trackId);
      setSessionId(resp.sessionId);
      setCurrentCaseId(resp.currentCaseId);
      setCaseNumber(resp.caseStage as 1 | 2 | 3);
      setProbeNumber(1);

      if (resp.step.type === 'probe') {
        setPendingStep(resp.step);
        setPhase('case_intro');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start session');
    } finally {
      setIsStarting(false);
    }
  }, [trackId]);

  const handleBeginCase = useCallback(() => {
    if (!pendingStep) return;
    setActiveStep(pendingStep);
    setPendingStep(null);
    setAnswer('');
    setPhase('probe');
  }, [pendingStep]);

  const handleSubmit = useCallback(async () => {
    if (!sessionId || !activeStep) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const resp = await submitAnswer(sessionId, {
        rawResponse: answer,
        selectedOptionId,
        selectedOptionIds: selectedOptionIds.length > 0 ? selectedOptionIds : undefined,
      });

      if (resp.status === 'COMPLETE') {
        setResult(resp.result ?? null);
        setPhase('results');
        return;
      }

      const prevCaseStage = caseNumber;
      const nextCaseStage = resp.caseStage as 1 | 2 | 3;
      const caseChanged = nextCaseStage !== prevCaseStage;

      setCaseNumber(nextCaseStage);
      setCurrentCaseId(resp.currentCaseId);

      if (resp.step.type === 'probe') {
        if (caseChanged) {
          setPendingStep(resp.step);
          setProbeNumber(1);
          setAnswer('');
          setSelectedOptionId(undefined);
          setSelectedOptionIds([]);
          setPhase('case_intro');
        } else {
          setActiveStep(resp.step);
          setProbeNumber((n) => n + 1);
          setAnswer('');
          setSelectedOptionId(undefined);
          setSelectedOptionIds([]);
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, activeStep, answer, selectedOptionId, selectedOptionIds, caseNumber]);

  const handleRestart = useCallback(() => {
    setPhase('intro');
    setSessionId(null);
    setCaseNumber(1);
    setCurrentCaseId(null);
    setProbeNumber(1);
    setPendingStep(null);
    setActiveStep(null);
    setAnswer('');
    setResult(null);
    setError(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="max-w-sm w-full text-center space-y-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    if (!trackIntro) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-neutral-500">Unknown track: {trackId}</p>
        </div>
      );
    }
    return (
      <DiagnosticIntro intro={trackIntro} onStart={handleStart} isStarting={isStarting} />
    );
  }

  if (phase === 'case_intro') {
    if (!caseContent) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-neutral-500">Loading case…</p>
        </div>
      );
    }
    return (
      <CaseIntro
        content={caseContent}
        caseNumber={caseNumber}
        onBegin={handleBeginCase}
      />
    );
  }

  if (phase === 'probe') {
    if (!activeStep || !caseContent) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-neutral-500">Loading probe…</p>
        </div>
      );
    }

    // Show a full-screen loading state when the final probe is being analysed —
    // the batch AI extraction call takes ~30–60 seconds and the button spinner
    // alone gives no feedback about what's happening.
    const isFinalProbe = caseNumber === 3 && probeNumber === TOTAL_PROBES;
    if (isSubmitting && isFinalProbe) {
      return (
        <div className="h-screen bg-white flex flex-col">
          {/* Thin top bar */}
          <div className="h-12 bg-[#0A0A0A] flex items-center px-6 shrink-0">
            <span className="text-white text-xs font-mono tracking-widest">VIZON</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-5">
            {/* Sliding blue bar */}
            <div className="w-48 h-px bg-neutral-100 relative overflow-hidden">
              <div className="absolute inset-y-0 w-24 bg-[#1A56DB] animate-[slide_1.5s_ease-in-out_infinite]" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-sm text-neutral-900 tracking-wider uppercase">
                Analysing your diagnostic
              </p>
              <p className="font-mono text-xs text-neutral-400">
                Reviewing 15 responses · 30–60 seconds
              </p>
            </div>
          </div>
        </div>
      );
    }

    const handleToggleOptionId = (id: string) => {
      setSelectedOptionIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    return (
      <ProbeDisplay
        step={activeStep}
        caseContent={caseContent}
        probeContent={probeContent}
        caseNumber={caseNumber}
        probeNumber={probeNumber}
        totalProbes={TOTAL_PROBES}
        answer={answer}
        onAnswerChange={setAnswer}
        selectedOptionId={selectedOptionId}
        onSelectOption={setSelectedOptionId}
        selectedOptionIds={selectedOptionIds}
        onToggleOptionId={handleToggleOptionId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (phase === 'results') {
    if (!result) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-neutral-500">Computing results…</p>
        </div>
      );
    }
    return (
      <DiagnosticResults result={result} trackId={trackId} onRestart={handleRestart} />
    );
  }

  return null;
}
