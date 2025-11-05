'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavigationLink from '@/components/ui/NavigationLink';
import { NAVIGATION_ITEMS } from '@/constants/navigation';

const NAVBAR_HEIGHT = 80;
const LOGO_SIZE = 40;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center" aria-label="Home">
            <Image
              src="/images/logo.png"
              alt="Traveler Logo"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationLink key={item.href} {...item} />
            ))}
          </div>

          <button
            type="button"
            className="md:hidden text-gray-900 text-2xl"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <i className={isMenuOpen ? 'bi-x' : 'bi-list'} aria-hidden="true" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4" onClick={handleCloseMenu}>
              {NAVIGATION_ITEMS.map((item) => (
                <NavigationLink key={item.href} {...item} isMobile />
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
}
