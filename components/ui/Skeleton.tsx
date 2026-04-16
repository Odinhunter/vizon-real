'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      className={`rounded-xl bg-[#e2e6ea] animate-pulse motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}
