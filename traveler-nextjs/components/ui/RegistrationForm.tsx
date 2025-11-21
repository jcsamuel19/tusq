'use client';

import { useState, useRef } from 'react';
import PhoneInput from './PhoneInput';
import { isValidUSPhone, toE164US } from '@/lib/utils/phoneValidation';

interface RegistrationFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export default function RegistrationForm({ onSubmit, error, isLoading }: RegistrationFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const phoneRef = useRef('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!phoneRef.current || !isValidUSPhone(phoneRef.current)) {
      errors.phone = 'Please enter a valid US phone number';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!ageConfirmed) {
      errors.age = 'You must confirm you are 18 or older';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneRef.current,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (formErrors.firstName) {
                setFormErrors((prev) => ({ ...prev, firstName: '' }));
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
            placeholder="John"
            disabled={isLoading}
          />
          {formErrors.firstName && (
            <p className="text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (formErrors.lastName) {
                setFormErrors((prev) => ({ ...prev, lastName: '' }));
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
            placeholder="Doe"
            disabled={isLoading}
          />
          {formErrors.lastName && (
            <p className="text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) {
              setFormErrors((prev) => ({ ...prev, email: '' }));
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
          placeholder="your.email@example.com"
          disabled={isLoading}
        />
        {formErrors.email && (
          <p className="text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number (US only) *
        </label>
        <PhoneInput
          id="phone"
          value=""
          onChange={(v) => {
            phoneRef.current = v;
            if (formErrors.phone) {
              setFormErrors((prev) => ({ ...prev, phone: '' }));
            }
          }}
          autoFocus={false}
        />
        {formErrors.phone && (
          <p className="text-sm text-red-600">{formErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) {
              setFormErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
          placeholder="At least 8 characters"
          disabled={isLoading}
        />
        {formErrors.password && (
          <p className="text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (formErrors.confirmPassword) {
              setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-0"
          placeholder="Confirm your password"
          disabled={isLoading}
        />
        {formErrors.confirmPassword && (
          <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          id="ageConfirm"
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => {
            setAgeConfirmed(e.target.checked);
            if (formErrors.age) {
              setFormErrors((prev) => ({ ...prev, age: '' }));
            }
          }}
          className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          disabled={isLoading}
        />
        <label htmlFor="ageConfirm" className="text-sm text-gray-700">
          You must be 18 or above to use Tusq.{' '}
          <a href="/tos" className="text-blue-600 hover:underline">View our TOS.</a>
        </label>
      </div>
      {formErrors.age && (
        <p className="text-sm text-red-600">{formErrors.age}</p>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-6 py-2 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
