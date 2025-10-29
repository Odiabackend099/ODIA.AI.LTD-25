import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingButton = ({ onClick, isDark = false }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50 z-50 ${
        isDark 
          ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' 
          : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
      }`}
      aria-label="Open chat"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
};

export default FloatingButton;