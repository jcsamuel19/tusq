'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      // rudimentary focus trap: focus dialog on open
      queueMicrotask(() => dialogRef.current?.focus());
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm md:backdrop-blur animate-fadeIn"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl outline-none animate-scaleIn"
      >
        {title ? (
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10 8.586 4.293 2.879A1 1 0 1 0 2.879 4.293L8.586 10l-5.707 5.707a1 1 0 1 0 1.414 1.414L10 11.414l5.707 5.707a1 1 0 0 0 1.414-1.414L11.414 10l5.707-5.707A1 1 0 1 0 15.707 2.88z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : null}
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 200ms ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 220ms ease-out forwards; opacity: 0; transform: scale(0.98); }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes scaleIn { to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}


