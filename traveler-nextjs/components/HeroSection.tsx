'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import PhoneInput from '@/components/ui/PhoneInput';
import ChatWindow from '@/components/ui/ChatWindow';
import { isValidUSPhone, toE164US } from '@/lib/utils/phoneValidation';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string>('');
  const phoneRef = useRef('');
  const errorRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  function openModal() {
    setIsModalOpen(true);
    phoneRef.current = '';
    errorRef.current = null;
    setError(null);
    setAgeConfirmed(false);
    setModalKey((prev) => prev + 1);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phone = phoneRef.current;
    const valid = isValidUSPhone(phone);
    if (!valid) {
      const errorMsg = 'Please enter a valid US phone number.';
      errorRef.current = errorMsg;
      setError(errorMsg);
      return;
    }
    if (!ageConfirmed) {
      const errorMsg = 'You must confirm you are 18 or older to continue.';
      errorRef.current = errorMsg;
      setError(errorMsg);
      return;
    }

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Success - show chat window (in-app messaging mode)
      const e164Phone = toE164US(phone);
      setUserId(data.userId);
      setUserPhone(e164Phone || phone);
      closeModal();
      setShowChat(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to sign up. Please try again.';
      errorRef.current = errorMsg;
      setError(errorMsg);
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Get Started">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (US only)
            </label>
            <PhoneInput
              key={`phone-${modalKey}`}
              id="phone"
              autoFocus
              value=""
              onChange={(v) => {
                phoneRef.current = v;
                // Clear error on typing if one exists (only causes re-render if error was set)
                if (errorRef.current) {
                  errorRef.current = null;
                  setError(null);
                }
              }}
            />
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              id="ageConfirm"
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="ageConfirm" className="text-sm text-gray-700">
              You must be 18 or above to use Tusq.{' '}
              <a href="/tos" className="text-blue-600 hover:underline">View our TOS.</a>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        </form>
      </Modal>

      {/* Chat Window Modal */}
      {showChat && userId && (
        <Modal 
          isOpen={showChat} 
          onClose={() => setShowChat(false)} 
          title="Complete Your Survey"
          size="large"
        >
          <div className="mt-4">
            <ChatWindow
              phoneNumber={userPhone}
              userId={userId}
              onComplete={() => {
                setShowChat(false);
                // Optionally show a success message
                alert('Survey completed! Thank you for signing up.');
              }}
            />
          </div>
        </Modal>
      )}
    </section>
  );
}
