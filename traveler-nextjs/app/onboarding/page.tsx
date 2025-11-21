'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/ui/ChatWindow';
import EmailInput from '@/components/ui/EmailInput';
import Navbar from '@/components/Navbar';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [emailCollected, setEmailCollected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(true);

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

    // Check if user already has an email
    const checkUserEmail = async () => {
      try {
        const response = await fetch(`/api/users/${userIdParam}`);
        if (response.ok) {
          const user = await response.json();
          if (user.email) {
            // User already has email, skip email input
            setEmailCollected(true);
          }
        }
      } catch (err) {
        console.error('Error checking user email:', err);
        // Continue to email input if check fails
      } finally {
        setCheckingEmail(false);
      }
    };

    checkUserEmail();
  }, [searchParams, router]);

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save email');
      }

      // Email saved successfully, show chat window
      setEmailCollected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || !phoneNumber || !firstName || checkingEmail) {
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
          {!emailCollected ? (
            <EmailInput
              onSubmit={handleEmailSubmit}
              error={error}
              isLoading={isLoading}
            />
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  The Ultimate Side Quest
                </h1>
                <p className="text-gray-600">
                  Your Challenge Awaits!
                </p>
              </div>
              <ChatWindow
                phoneNumber={phoneNumber}
                userId={userId}
                firstName={firstName}
                // Keep chat window open after survey completion - no redirect
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
