'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import {
  HERO_HEADING_LINES,
  HERO_DESCRIPTION,
  PHONE_CONTENT_DATA,
  PHONE_SCREEN_POSITION,
} from '@/constants/hero';

const PHONE_FRAME_SIZE = {
  width: 400,
  height: 800,
};

function PhoneContent() {
  const { topImage, locationTag, heading, description, bottomImage } =
    PHONE_CONTENT_DATA;

  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-[2.5rem]"
      style={PHONE_SCREEN_POSITION}
    >
      <div className="relative w-full h-[45%] overflow-hidden">
        <Image
          src={topImage}
          alt="Travel destination"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-white w-full flex-1 p-5 flex flex-col justify-center relative">
        <span className="absolute top-3 right-4 bg-black text-white text-xs font-bold px-2.5 py-1 rounded">
          {locationTag}
        </span>
        <h2 className="text-xl font-bold uppercase text-gray-900 mb-2 mt-2">
          {heading}
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="relative w-full h-[30%] overflow-hidden">
        <Image
          src={bottomImage}
          alt="Travel destination"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
      <div className="relative w-full max-w-md h-full max-h-[85vh] flex items-center justify-center">
        <div className="relative w-full h-full max-h-[600px] aspect-[9/19] flex items-center justify-center">
          <Image
            src="/assets/images/home/phone.png"
            alt="Phone mockup showing travel app"
            width={PHONE_FRAME_SIZE.width}
            height={PHONE_FRAME_SIZE.height}
            className="w-full h-full object-contain relative z-10 pointer-events-none"
            priority
          />
          <PhoneContent />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full overflow-hidden pt-20">
      <div className="flex h-screen w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col justify-center w-full lg:w-1/2 gap-8 lg:gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-tight tracking-tight text-gray-900 text-left">
              {HERO_HEADING_LINES.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <p className="text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed text-left">
            {HERO_DESCRIPTION}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
            <Button href="#" variant="primary">
              Get started
            </Button>
            <Button href="#" variant="secondary">
              <i className="bi bi-play-circle-fill text-xl" aria-hidden="true" />
              <span>Learn more</span>
            </Button>
          </div>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
