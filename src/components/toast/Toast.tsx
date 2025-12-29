//src/components/toast/Toast.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, isVisible, type, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-blue-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 max-w-sm`}
    >
      <Icon className="w-5 h-5" />
      <p>{message}</p>
      <button
        onClick={onClose}
        className="text-white font-bold hover:text-gray-200"
      >
        ×
      </button>
    </motion.div>
  );
}