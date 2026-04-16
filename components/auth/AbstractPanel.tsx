'use client';

import { motion } from 'framer-motion';

export default function AbstractPanel() {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-3xl"
      style={{
        background:
          'linear-gradient(160deg, #051c2c 0%, #0a3d62 35%, #1A56DB 70%, #2d6ff2 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(26,86,219,0.4) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 70% 80%, rgba(99,145,255,0.25) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(5,28,44,0.3) 0%, transparent 70%)',
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panelFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A56DB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6391ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="panelFlow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d6ff2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#051c2c" stopOpacity="0.1" />
          </linearGradient>
          <filter id="panelBlur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          <filter id="panelBlur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
        </defs>

        {/* Ambient drifting ellipses */}
        <motion.ellipse
          cx="150"
          cy="250"
          rx="250"
          ry="180"
          fill="url(#panelFlow1)"
          filter="url(#panelBlur1)"
          opacity="0.8"
          animate={{ cx: [150, 180, 140, 150], cy: [250, 270, 230, 250] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="450"
          cy="600"
          rx="220"
          ry="280"
          fill="url(#panelFlow2)"
          filter="url(#panelBlur1)"
          opacity="0.6"
          animate={{ cx: [450, 420, 460, 450], cy: [600, 580, 620, 600] }}
          transition={{ duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        <path
          d="M0,300 Q150,200 300,350 T600,280"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#panelBlur2)"
        />
        <path
          d="M0,500 Q200,400 400,550 T600,450"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          fill="none"
          filter="url(#panelBlur2)"
        />
      </svg>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5,28,44,0.4) 100%)',
        }}
      />

      {/* Branding */}
      <div className="absolute bottom-10 left-10 right-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-[5px] h-[5px] rounded-full bg-[#e8521a]" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Vizon
          </span>
        </div>
        <p className="text-[22px] font-semibold text-white/70 leading-snug max-w-[280px]">
          Know where you stand before you walk in.
        </p>
      </div>
    </div>
  );
}
