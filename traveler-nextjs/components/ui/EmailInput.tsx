'use client';

import { useState } from 'react';

interface EmailInputProps {
  onSubmit: (email: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export default function EmailInput({ onSubmit, error, isLoading }: EmailInputProps) {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }

    await onSubmit(email.trim().toLowerCase());
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Almost there!
        </h2>
        <p className="text-gray-600">
          We just need your email to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formError) {
                setFormError(null);
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
            placeholder="your.email@example.com"
            disabled={isLoading}
            autoFocus
          />
          {(formError || error) && (
            <p className="mt-2 text-sm text-red-600">{formError || error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}


