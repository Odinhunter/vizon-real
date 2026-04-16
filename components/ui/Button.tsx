'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1A56DB] text-white hover:bg-[#1548b8] disabled:opacity-40',
  secondary:
    'bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/[0.1] hover:border-white/20 disabled:opacity-40',
  ghost:
    'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.06] disabled:opacity-40',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 disabled:opacity-40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px] rounded-lg gap-1.5',
  md: 'px-6 py-3.5 text-[15px] rounded-xl gap-2',
  lg: 'px-8 py-4 text-[16px] rounded-xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      className = '',
      type = 'button',
      onClick,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={onClick}
        className={`inline-flex items-center justify-center font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <>
            <Spinner />
            {children}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
