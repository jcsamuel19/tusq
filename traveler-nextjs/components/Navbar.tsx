'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo/logo.png"
              alt="Traveler Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#destinations" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Destinations
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link
              href="#download"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900 text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={isMenuOpen ? 'bi-x' : 'bi-list'}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="#about" className="text-base font-medium text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link href="#destinations" className="text-base font-medium text-gray-700 hover:text-gray-900">
                Destinations
              </Link>
              <Link href="#features" className="text-base font-medium text-gray-700 hover:text-gray-900">
                Features
              </Link>
              <Link href="#contact" className="text-base font-medium text-gray-700 hover:text-gray-900">
                Contact
              </Link>
              <Link
                href="#download"
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Download
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
