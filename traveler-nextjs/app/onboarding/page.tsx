'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/ui/ChatWindow';
import Navbar from '@/components/Navbar';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const phoneParam = searchParams.get('phone');
    const firstNameParam = searchParams.get('firstName');

    if (!userIdParam || !phoneParam || !firstNameParam) {
      // Redirect to home if missing required params
      router.push('/');
      return;
    }

    setUserId(userIdParam);
    setPhoneNumber(decodeURIComponent(phoneParam));
    setFirstName(decodeURIComponent(firstNameParam));
  }, [searchParams, router]);

  if (!userId || !phoneNumber || !firstName) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-32">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Let's personalize your experience. This will only take a minute.
            </p>
          </div>
          <ChatWindow
            phoneNumber={phoneNumber}
            userId={userId}
            firstName={firstName}
            onComplete={() => {
              // Redirect to home or dashboard after completion
              router.push('/?survey=complete');
            }}
          />
        </div>
      </div>
    </main>
  );
}
