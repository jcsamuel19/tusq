'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { NavigationItem } from '@/types';

interface NavigationLinkProps extends NavigationItem {
  isMobile?: boolean;
}

export default function NavigationLink({
  label,
  href,
  isButton = false,
  isMobile = false,
}: NavigationLinkProps) {
  if (isButton) {
    return (
      <Link
        href={href}
        className={cn(
          'px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors',
          isMobile && 'text-center'
        )}
      >
        {label}
      </Link>
    );
  }

  const baseClasses = isMobile
    ? 'text-base font-medium text-gray-700 hover:text-gray-900'
    : 'text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors';

  return (
    <Link href={href} className={baseClasses}>
      {label}
    </Link>
  );
}
