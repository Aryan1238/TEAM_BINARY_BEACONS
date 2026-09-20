import React, { useState } from 'react';
import { Wifi, Battery, Signal, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const DeviceFrame = ({ children }) => {
  const [scale, setScale] = useState(1);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-md relative overflow-x-hidden">
      
      {/* Frame Zoom Controls Header */}
      <div className="mb-4 flex items-center gap-3 bg-stone-800/80 backdrop-blur-md border border-stone-700 text-stone-300 px-4 py-1.5 rounded-full text-xs shadow-lg">
        <span className="font-semibold text-emerald-400">📱 Mobile Device Preview (Figma View)</span>
        <span className="text-stone-600">|</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((prev) => Math.max(0.75, prev - 0.05))}
            className="p-1 hover:text-white transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(1.15, prev + 0.05))}
            className="p-1 hover:text-white transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1 hover:text-white transition ml-1 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* iPhone 15 Pro Titanium Frame Container */}
      <div
        className="transition-transform duration-200 origin-top"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="relative mx-auto w-[385px] sm:w-[412px] h-[844px] sm:h-[860px] bg-black rounded-[54px] p-3.5 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_12px_#27272a,0_0_0_14px_#3f3f46,0_0_0_16px_#18181b] border-4 border-stone-700/50">
          
          {/* Left Side Buttons (Volume & Action Button) */}
          <div className="absolute -left-[18px] top-28 w-[4px] h-9 bg-stone-700 rounded-l-md" />
          <div className="absolute -left-[18px] top-44 w-[4px] h-12 bg-stone-700 rounded-l-md" />
          <div className="absolute -left-[18px] top-60 w-[4px] h-12 bg-stone-700 rounded-l-md" />
          {/* Right Side Power Button */}
          <div className="absolute -right-[18px] top-40 w-[4px] h-16 bg-stone-700 rounded-r-md" />

          {/* Internal Screen Area */}
          <div className="relative w-full h-full bg-[#F6F1EA] rounded-[42px] overflow-hidden flex flex-col shadow-inner">
            
            {/* Status Bar */}
            <div className="sticky top-0 z-50 bg-[#FAF6F0]/90 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-stone-900 text-xs font-semibold select-none">
              <span className="font-mono text-[11px]">{currentTime}</span>

              {/* Dynamic Island Pill */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full flex items-center justify-between px-2 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a1426] border border-blue-900/40" />
              </div>

              {/* Signal, WiFi, Battery */}
              <div className="flex items-center gap-1.5 text-stone-800">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 fill-stone-900" />
              </div>
            </div>

            {/* Scrollable Content View */}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
              {children}
            </div>

            {/* iOS Bottom Home Bar */}
            <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[#0F382A] to-transparent pt-2 pb-1.5 flex justify-center pointer-events-none">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
