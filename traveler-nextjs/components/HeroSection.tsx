'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import RegistrationForm from '@/components/ui/RegistrationForm';
import {
  HERO_HEADING_LINES,
  HERO_DESCRIPTION,
} from '@/constants/hero';
import { useRouter } from 'next/navigation';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function openModal() {
    setIsModalOpen(true);
    setError(null);
  }

  function closeModal() {
    setIsModalOpen(false);
    setError(null);
  }

  async function handleRegistration(data: {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
  }) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      // Success - redirect to onboarding
      closeModal();
      router.push(
        `/onboarding?userId=${result.userId}&phone=${encodeURIComponent(result.phoneNumber)}&firstName=${encodeURIComponent(result.firstName)}`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

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
            <Button variant="primary" onClick={openModal}>
              Get Started
            </Button>
          </div>
        </div>

        <PhoneMockup />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Your Account" size="large">
        <RegistrationForm
          onSubmit={handleRegistration}
          error={error}
          isLoading={isLoading}
        />
      </Modal>
    </section>
  );
}
