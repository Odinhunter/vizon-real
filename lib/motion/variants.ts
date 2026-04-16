/**
 * Shared framer-motion variants used throughout the app.
 * Uses the project's canonical ease: cubic-bezier(0.16, 1, 0.3, 1)
 */

import type { Variants, Transition } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

// ─── Entry animations ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

// ─── Container for staggered children ────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ─── Hover / interaction ─────────────────────────────────────────────────────

export const cardHoverLift = {
  rest: { y: 0, scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
    transition: { duration: 0.25, ease },
  },
};

export const buttonPress = {
  whileTap: { scale: 0.97 },
};

// ─── Page / phase transitions ────────────────────────────────────────────────

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
};

// ─── Dropdown ────────────────────────────────────────────────────────────────

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1 } },
};

// ─── Error banner ────────────────────────────────────────────────────────────

export const errorBanner: Variants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: 'auto', marginBottom: 20, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2 } },
};
