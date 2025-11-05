'use client';

import Image from 'next/image';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 lg:p-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Download our app and discover amazing destinations around the world. Start planning your next adventure today.
          </p>
          
          {/* App Store Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-block transition-transform hover:scale-105"
              aria-label="Download on App Store"
            >
              <Image
                src="/assets/images/brand-logos/app-store-badge.png"
                alt="Download on App Store"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </a>
            <a
              href="#"
              className="inline-block transition-transform hover:scale-105"
              aria-label="Get it on Google Play"
            >
              <Image
                src="/assets/images/brand-logos/google-play-badge.png"
                alt="Get it on Google Play"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
