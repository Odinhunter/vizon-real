'use client';

import { useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

interface ShareButtonProps {
  sessionId: string;
  title?: string;
}

export default function ShareButton({ sessionId, title = 'Vizon Diagnostic Results' }: ShareButtonProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/results/${sessionId}`
    : `/results/${sessionId}`;

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setToastVisible(true);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setToastVisible(true);
    }
  }, [url, title]);

  const dismissToast = useCallback(() => setToastVisible(false), []);

  return (
    <>
      <button
        onClick={handleShare}
        className="flex-1 py-4 bg-[#1A56DB] text-white font-mono text-[11px] tracking-[0.15em] uppercase rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share Results
      </button>
      <Toast message="Link copied!" visible={toastVisible} onDismiss={dismissToast} />
    </>
  );
}
