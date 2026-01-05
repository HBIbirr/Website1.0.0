
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-indigo-600';

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[300] ${bgColor} text-white px-8 py-3.5 rounded-2xl shadow-2xl flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300 min-w-[200px]`}>
      <span className="text-sm font-bold tracking-wide">{message}</span>
    </div>
  );
};

export default Toast;
