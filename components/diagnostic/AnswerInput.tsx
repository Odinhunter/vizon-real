'use client';

import { useEffect, useRef } from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minLength?: number;
}

const DEFAULT_PLACEHOLDER =
  'Write your response here. Be specific and reason through your thinking clearly.';

export default function AnswerInput({
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  minLength = 20,
}: AnswerInputProps) {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < minLength;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-1.5">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={8}
        className={`
          w-full resize-none border bg-white px-4 py-3.5
          font-mono text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 placeholder:font-mono
          focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-shadow duration-150
          ${isTooShort ? 'border-[#BFDBFE]' : 'border-neutral-200'}
        `}
      />
      <div className="flex items-center justify-between px-1">
        {isTooShort ? (
          <p className="text-[10px] font-mono text-[#1E40AF] tracking-wide">
            Keep going — a fuller response gives better signal.
          </p>
        ) : (
          <span />
        )}
        <span className="text-[10px] font-mono text-neutral-500 ml-auto">
          {charCount} {charCount === 1 ? 'char' : 'chars'}
        </span>
      </div>
    </div>
  );
}
