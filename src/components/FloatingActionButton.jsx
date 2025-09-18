'use client';

import { useState } from 'react';

const FloatingActionButton = ({ onClick, isFormOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative bg-indigo-600 hover:bg-indigo-700 text-white 
          rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-in-out
          ${isFormOpen ? 'rotate-45' : 'rotate-0'}
          ${isHovered ? 'scale-110' : 'scale-100'}
          w-14 h-14 flex items-center justify-center
          focus:outline-none focus:ring-4 focus:ring-indigo-300
        `}
        aria-label={isFormOpen ? 'Close form' : 'Create new study block'}
      >
        {/* Icon */}
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isFormOpen ? 'rotate-45' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150" />
        
        {/* Tooltip */}
        <div className={`
          absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm 
          rounded-lg whitespace-nowrap transition-all duration-200
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
        `}>
          {isFormOpen ? 'Close form' : 'Create study block'}
          <div className="absolute top-1/2 left-full w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2" />
        </div>
      </button>

      {/* Background pulse animation when form is open */}
      {isFormOpen && (
        <div className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20" />
      )}
    </div>
  );
};

export default FloatingActionButton;
