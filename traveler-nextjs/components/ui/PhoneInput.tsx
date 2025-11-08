'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { formatUSPhone, isValidUSPhone } from '@/lib/utils/phoneValidation';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  id?: string;
  autoFocus?: boolean;
}

function PhoneInput({ value = '', onChange, onValidityChange, id, autoFocus }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isTypingRef = useRef(false);
  const hasFocusRef = useRef(false);
  const [initialValue] = useState(() => formatUSPhone(value));

  // Track focus state
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleFocus = () => {
      hasFocusRef.current = true;
      isTypingRef.current = false;
    };
    const handleBlur = () => {
      hasFocusRef.current = false;
      // Allow external updates after a delay when focus is lost
      setTimeout(() => {
        isTypingRef.current = false;
      }, 200);
    };

    el.addEventListener('focus', handleFocus);
    el.addEventListener('blur', handleBlur);

    return () => {
      el.removeEventListener('focus', handleFocus);
      el.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Sync value prop to input only when not typing and not focused (for external resets)
  useEffect(() => {
    if (!isTypingRef.current && !hasFocusRef.current && inputRef.current) {
      const formatted = formatUSPhone(value);
      if (inputRef.current.value !== formatted) {
        inputRef.current.value = formatted;
      }
    }
  }, [value]);

  function getDigitCountBeforeCaret(rawValue: string, caret: number): number {
    const left = rawValue.slice(0, caret);
    return (left.match(/\d/g) || []).length;
  }

  function caretPosForDigitIndex(formattedValue: string, digitIndex: number): number {
    if (digitIndex <= 0) return 0;
    let count = 0;
    for (let i = 0; i < formattedValue.length; i++) {
      if (/\d/.test(formattedValue[i])) count++;
      if (count >= digitIndex) return i + 1;
    }
    return formattedValue.length;
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const rawValue = inputEl.value;
    const caret = inputEl.selectionStart ?? rawValue.length;
    const digitIndex = getDigitCountBeforeCaret(rawValue, caret);

    const formatted = formatUSPhone(rawValue);
    const nextPos = caretPosForDigitIndex(formatted, digitIndex);

    // Mark that we're typing to prevent external value updates
    isTypingRef.current = true;

    // Update input value directly (uncontrolled component approach)
    inputEl.value = formatted;
    
    // Restore caret position synchronously - must happen before any async operations
    try {
      inputEl.setSelectionRange(nextPos, nextPos);
    } catch {}

    // Ensure focus is maintained - check and restore immediately
    if (document.activeElement !== inputEl) {
      inputEl.focus();
      try {
        inputEl.setSelectionRange(nextPos, nextPos);
      } catch {}
    }

    // Notify parent components asynchronously using a double RAF to ensure DOM is settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onChange?.(formatted);
        onValidityChange?.(isValidUSPhone(formatted));
        
        // Reset typing flag after callbacks, but only if still focused
        if (hasFocusRef.current) {
          setTimeout(() => {
            isTypingRef.current = false;
          }, 150);
        }
      });
    });
  }

  return (
    <input
      ref={inputRef}
      id={id}
      autoFocus={autoFocus}
      inputMode="numeric"
      autoComplete="tel"
      placeholder="(555) 123-4567"
      defaultValue={initialValue}
      onInput={handleInput}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:border-gray-900 focus:ring-0"
    />
  );
}

export default memo(PhoneInput);


