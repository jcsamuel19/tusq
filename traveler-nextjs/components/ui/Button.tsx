'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  href,
  variant = 'primary',
  className,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center px-8 py-4 font-semibold text-base rounded-lg transition-all duration-300';
  
  const variants = {
    primary:
      'bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02] shadow-lg',
    secondary:
      'border-2 border-gray-900 text-gray-900 bg-white hover:bg-gray-900 hover:text-white',
  };

  const combinedClassName = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}
