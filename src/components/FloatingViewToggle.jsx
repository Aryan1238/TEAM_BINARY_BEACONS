import React from 'react';
import { Layout, Smartphone } from 'lucide-react';

export const FloatingViewToggle = ({ viewMode, onToggle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-md p-1 rounded-full shadow-2xl border border-stone-300 flex items-center gap-1 ring-4 ring-black/5">
        
        {/* Website Button */}
        <button
          onClick={() => onToggle('website')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            viewMode === 'website'
              ? 'bg-[#0F382A] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Website</span>
        </button>

        {/* Mobile Button */}
        <button
          onClick={() => onToggle('mobile')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-[#0F382A] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>

      </div>
    </div>
  );
};
