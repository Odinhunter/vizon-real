'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProbeStep, DiagnosticReport, InProgressSessionInfo } from '@/lib/api/diagnosticClient';
import { startSession, submitAnswer, getInProgressSession, resumeSession } from '@/lib/api/diagnosticClient';
import { getCaseContent, getProbeContent, getTrackIntro } from '@/content/index';
import { pageTransition } from '@/lib/motion/variants';
import DiagnosticIntro from './DiagnosticIntro';
import ResumePrompt from './ResumePrompt';
import UserSetup from './UserSetup';
import CaseIntro from './CaseIntro';
import ProbeDisplay from './ProbeDisplay';
import DiagnosticResults from './DiagnosticResults';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';

interface DiagnosticControllerProps {
  trackId: string;
}

type Phase = 'intro' | 'resume_prompt' | 'user_setup' | 'case_intro' | 'probe' | 'results';

export default function DiagnosticController({ trackId }: DiagnosticControllerProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [isStartingFresh, setIsStartingFresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume state
  const [inProgressSession, setInProgressSession] = useState<InProgressSessionInfo | null>(null);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLastProbe, setIsLastProbe] = useState(false);
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
  const [result, setResult] = useState<DiagnosticReport | null>(null);

  // ── Check for in-progress session on mount ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    getInProgressSession(trackId).then((session) => {
      if (cancelled || !session) return;
      setInProgressSession(session);
      // Race condition guard: only switch if we're still on the intro
      setPhase((prev) => (prev === 'intro' ? 'resume_prompt' : prev));
    }).catch(() => { /* silently ignore — don't block normal flow */ });
    return () => { cancelled = true; };
  }, [trackId]);

  // ── Guard: if phase is resume_prompt but session was cleared, return to intro ─
  useEffect(() => {
    if (phase === 'resume_prompt' && !inProgressSession) {
      setPhase('intro');
    }
  }, [phase, inProgressSession]);

  // ── Scroll to top on phase/probe change ──────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, probeNumber]);

  // ── Transition helper ────────────────────────────────────────────────────────
  const transitionTo = useCallback((nextPhase: Phase) => {
    setPhase(nextPhase);
  }, []);

  // ── Content lookups ────────────────────────────────────────────────────────

  const trackIntro = getTrackIntro(trackId);
  const caseContent = currentCaseId ? getCaseContent(currentCaseId) : null;
  const probeContent =
    activeStep?.variantId ? getProbeContent(activeStep.variantId) : null;

  // ── Transitions ────────────────────────────────────────────────────────────

  const beginSession = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const resp = await startSession(trackId);
      setSessionId(resp.sessionId);
      setCurrentCaseId(resp.currentCaseId);
      setCaseNumber(resp.caseStage as 1 | 2 | 3);
      setProbeNumber(1);
      setIsLastProbe(resp.isLastProbe ?? false);

      if (resp.step.type === 'probe') {
        setPendingStep(resp.step);
        transitionTo('case_intro');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start session');
    } finally {
      setIsStarting(false);
    }
  }, [trackId, transitionTo]);

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/profile');
      const { profile } = await res.json();
      if (profile?.completedAt) {
        await beginSession();
      } else {
        transitionTo('user_setup');
        setIsStarting(false);
      }
    } catch {
      // If profile check fails, still let them proceed
      await beginSession();
    }
  }, [beginSession, transitionTo]);

  const handleContinue = useCallback(async () => {
    if (!inProgressSession) return;
    setIsContinuing(true);
    setError(null);
    try {
      const resp = await resumeSession(inProgressSession.sessionId);
      setSessionId(resp.sessionId);
      setCurrentCaseId(resp.currentCaseId);
      setCaseNumber(resp.caseStage as 1 | 2 | 3);
      setProbeNumber(resp.probeNumber);
      setIsLastProbe(resp.isLastProbe ?? false);

      if (resp.step.type === 'probe') {
        setActiveStep(resp.step);
        setAnswer('');
        transitionTo('probe');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to resume session');
    } finally {
      setIsContinuing(false);
    }
  }, [inProgressSession, transitionTo]);

  const handleStartFresh = useCallback(async () => {
    setIsStartingFresh(true);
    setError(null);
    try {
      await beginSession();
    } finally {
      setIsStartingFresh(false);
    }
  }, [beginSession]);

  const handleUserSetupComplete = useCallback(async () => {
    await beginSession();
  }, [beginSession]);

  const handleUserSetupSkip = useCallback(async () => {
    await beginSession();
  }, [beginSession]);

  const handleBeginCase = useCallback(() => {
    if (!pendingStep) return;
    setActiveStep(pendingStep);
    setPendingStep(null);
    setAnswer('');
    transitionTo('probe');
  }, [pendingStep, transitionTo]);

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
        transitionTo('results');
        return;
      }

      const prevCaseStage = caseNumber;
      const nextCaseStage = resp.caseStage as 1 | 2 | 3;
      const caseChanged = nextCaseStage !== prevCaseStage;

      setCaseNumber(nextCaseStage);
      setCurrentCaseId(resp.currentCaseId);

      setIsLastProbe(resp.isLastProbe ?? false);

      if (resp.step.type === 'probe') {
        if (caseChanged) {
          setPendingStep(resp.step);
          setProbeNumber(1);
          setAnswer('');
          setSelectedOptionId(undefined);
          setSelectedOptionIds([]);
          transitionTo('case_intro');
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
  }, [sessionId, activeStep, answer, selectedOptionId, selectedOptionIds, caseNumber, transitionTo]);

  const handleRestart = useCallback(() => {
    transitionTo('intro');
    setSessionId(null);
    setCaseNumber(1);
    setCurrentCaseId(null);
    setProbeNumber(1);
    setPendingStep(null);
    setActiveStep(null);
    setAnswer('');
    setResult(null);
    setError(null);
    setIsLastProbe(false);
    setInProgressSession(null);
  }, [transitionTo]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="font-sans text-lg font-bold text-neutral-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-neutral-500 mb-6">{error}</p>
            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine phase content + key for AnimatePresence
  const renderPhase = () => {
    if (phase === 'intro') {
      if (!trackIntro) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-neutral-500">Unknown track: {trackId}</p>
          </div>
        );
      }
      return <DiagnosticIntro intro={trackIntro} onStart={handleStart} isStarting={isStarting} />;
    }

    if (phase === 'resume_prompt') {
      if (!inProgressSession) return null;
      return (
        <ResumePrompt
          session={inProgressSession}
          onContinue={handleContinue}
          onStartFresh={handleStartFresh}
          isContinuing={isContinuing}
          isStartingFresh={isStartingFresh}
        />
      );
    }

    if (phase === 'user_setup') {
      return <UserSetup onComplete={handleUserSetupComplete} onSkip={handleUserSetupSkip} />;
    }

    if (phase === 'case_intro') {
      if (!caseContent) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-neutral-500">Loading case…</p>
          </div>
        );
      }
      return <CaseIntro content={caseContent} caseNumber={caseNumber} onBegin={handleBeginCase} />;
    }

    if (phase === 'probe') {
      if (!activeStep || !caseContent) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-neutral-500">Loading probe…</p>
          </div>
        );
      }

      if (isSubmitting && isLastProbe) {
        return <AnalysisLoadingScreen />;
      }

      const handleToggleOptionId = (id: string) => {
        setSelectedOptionIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
      };

      return (
        <ProbeDisplay
          key={activeStep.probeId}
          step={activeStep}
          caseContent={caseContent}
          probeContent={probeContent}
          caseNumber={caseNumber}
          probeNumber={probeNumber}
          totalProbes={5}
          isLastProbe={isLastProbe}
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
      return <DiagnosticResults result={result} trackId={trackId} onRestart={handleRestart} sessionId={sessionId ?? undefined} />;
    }

    return null;
  };

  // Use a compound key so within-probe changes also animate
  const phaseKey = phase === 'probe' ? `probe-${activeStep?.probeId}-${probeNumber}` : phase;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phaseKey}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {renderPhase()}
      </motion.div>
    </AnimatePresence>
  );
}
