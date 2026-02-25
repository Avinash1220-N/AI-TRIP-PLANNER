
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100">
    <div className="relative">
      <div className="text-6xl mb-6 animate-bounce">🌿</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    </div>
    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
      Crafting Your Adventure
    </h3>
    <p className="text-gray-600 text-center max-w-md">
      Our AI is analyzing your preferences and creating the perfect itinerary just for you...
    </p>
    <div className="mt-6 flex space-x-2">
      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

export default LoadingSpinner;
