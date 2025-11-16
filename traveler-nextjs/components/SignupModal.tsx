'use client';

import { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  terms?: string;
  submit?: string;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetForm = useCallback(() => {
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setTermsAccepted(false);
    setErrors({});
    setShowSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      // Clear auto-close timeout if user manually closes
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
      resetForm();
      onClose();
    }
  }, [isSubmitting, resetForm, onClose]);

  // Auto-close modal after 4 seconds when success is shown
  useEffect(() => {
    if (showSuccess) {
      // Clear any existing timeout
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
      
      // Set new timeout to close after 4 seconds
      autoCloseTimeoutRef.current = setTimeout(() => {
        handleClose();
      }, 4000);
    }

    // Cleanup: clear timeout on unmount or when showSuccess changes
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
    };
  }, [showSuccess, handleClose]);

  // Format phone number as user types (US format)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (digits.length > 10) return phoneNumber;
    
    // Format as (XXX) XXX-XXXX
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    // Clear phone error when user starts typing
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate phone number (should be 10 digits after formatting)
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phoneNumber = 'Please enter a valid US phone number';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/signup/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.replace(/\D/g, ''),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create account');
      }

      // Success - show success message
      // Clear form fields but keep success state
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setTermsAccepted(false);
      setErrors({});
      setShowSuccess(true);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        {/* Success View */}
        {showSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <i className="bi bi-x text-2xl"></i>
              </button>
            </div>
            <div className="text-center pt-6 pb-8">
              {/* Green Checkmark */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/images/home/check.png"
                  alt="Success checkmark"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
              {/* Success Message */}
              <h3 className="text-xl font-semibold text-gray-900">
                Thanks for joining the waitlist
              </h3>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Join Waitlist</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <i className="bi bi-x text-2xl"></i>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) {
                  setErrors({ ...errors, firstName: undefined });
                }
              }}
              className={cn(
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-black',
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="John"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) {
                  setErrors({ ...errors, lastName: undefined });
                }
              }}
              className={cn(
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-black',
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="Doe"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (US only) *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={cn(
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-black',
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="(555) 123-4567"
              maxLength={14}
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Terms of Service */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: undefined });
                  }
                }}
                className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700">
                You must be 18 or above to use Tusq.{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View our TOS.
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join now'}
            </Button>
          </div>
        </form>
          </>
        )}
      </div>
    </Modal>
  );
}

