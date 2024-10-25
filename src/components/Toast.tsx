import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${
        type === 'success' ? 'bg-green-50' : 'bg-red-50'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
        )}
        <p className={`text-sm font-medium ${
          type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-opacity-20 ${
            type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
          }`}
        >
          <X className={`h-4 w-4 ${
            type === 'success' ? 'text-green-600' : 'text-red-600'
          }`} />
        </button>
      </div>
    </div>
  );
}