'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import {
  HERO_HEADING_LINES,
  HERO_DESCRIPTION,
} from '@/constants/hero';

const PHONE_FRAME_SIZE = {
  width: 400,
  height: 800,
};

function PhoneMockup() {
  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
      <div className="relative w-full max-w-md h-full max-h-[75vh] flex items-center justify-center">
        <div className="relative w-full h-full max-h-[600px] aspect-[9/19] flex items-center justify-center">
          <Image
            src="/assets/images/home/phone.png"
            alt="Phone mockup showing travel app"
            width={PHONE_FRAME_SIZE.width}
            height={PHONE_FRAME_SIZE.height}
            className="w-full h-full object-contain relative z-10 pointer-events-none phone-slide-in-right"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] w-full overflow-hidden pt-20">
      <div className="flex h-[85vh] w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="flex flex-col justify-center w-full lg:w-1/2 gap-6 lg:gap-7">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-tight tracking-tight text-gray-900 text-left cursor-pointer">
              {HERO_HEADING_LINES.map((line, index) => (
                <span key={index} className="block heading-line transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:text-gray-700">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="relative">
            <p className="text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed text-left">
              {HERO_DESCRIPTION}
            </p>
            <div className="absolute top-full left-0 -mt-[38px] ml-[15px]">
              <Image
                src="/images/arrow.png"
                alt=""
                width={190}
                height={190}
                className="object-contain -scale-x-100 -scale-y-100"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-[15px] pl-40 ml-[10px]">
            <Button href="#" variant="primary">
              Get Started
            </Button>
          </div>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
