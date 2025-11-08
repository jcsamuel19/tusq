'use client';

import Image from 'next/image';
import Link from 'next/link';

const LOGO_SIZE = 120;

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfdfd]">
      <div className="w-full">
        <div className="flex justify-start items-center h-20 pl-4">
          <Link href="/" className="flex items-center translate-y-[17px] -translate-x-5" aria-label="Home">
            <Image
              src="/images/logo.png"
              alt="Traveler Logo"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="object-contain"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
