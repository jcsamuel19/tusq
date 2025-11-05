'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full overflow-hidden pt-20">
      <div className="flex h-screen w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        {/* Left Content */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 gap-8 lg:gap-10">
          {/* Main Heading */}
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-tight tracking-tight text-gray-900 text-left">
              <span className="block">Discover the</span>
              <span className="block">hidden</span>
              <span className="block">Parts of the</span>
              <span className="block">world</span>
            </h1>
          </div>

          {/* Description Text */}
          <p className="text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed text-left">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit Lorem ipsum dolor sit amet.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
            {/* Primary CTA */}
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold text-base rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Get started
            </a>
            
            {/* Secondary CTA */}
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold text-base rounded-lg bg-white hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <i className="bi bi-play-circle-fill text-xl"></i>
              <span>Learn more</span>
            </a>
          </div>
        </div>

        {/* Right Content - Phone Mockup with Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="relative w-full max-w-md h-full max-h-[85vh] flex items-center justify-center">
            {/* Phone Frame */}
            <div className="relative w-full h-full max-h-[600px] aspect-[9/19] flex items-center justify-center">
              <Image
                src="/assets/images/home/phone.png"
                alt="Phone mockup"
                width={400}
                height={800}
                className="w-full h-full object-contain relative z-10 pointer-events-none"
                priority
              />
              
              {/* Content Inside Phone Screen */}
              <div 
                className="absolute flex flex-col overflow-hidden rounded-[2.5rem]" 
                style={{ 
                  top: '6%', 
                  left: '7%', 
                  right: '7%', 
                  bottom: '6%',
                  width: '86%',
                  height: '88%'
                }}
              >
                {/* Top Image */}
                <div className="relative w-full h-[45%] overflow-hidden">
                  <Image
                    src="/assets/images/home/hiking1.jpg"
                    alt="Travel destination"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Middle Text Section */}
                <div className="bg-white w-full flex-1 p-5 flex flex-col justify-center relative">
                  <span className="absolute top-3 right-4 bg-black text-white text-xs font-bold px-2.5 py-1 rounded">
                    LONDON
                  </span>
                  <h2 className="text-xl font-bold uppercase text-gray-900 mb-2 mt-2">
                    Discover the world
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>

                {/* Bottom Image */}
                <div className="relative w-full h-[30%] overflow-hidden">
                  <Image
                    src="/assets/images/home/hiking2.jpg"
                    alt="Travel destination"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
