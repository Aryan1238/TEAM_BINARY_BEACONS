import React from 'react';
import {
  Scan,
  Camera,
  ChevronRight,
  Activity,
  ChevronDown
} from 'lucide-react';
import { getUiTranslation } from '../data/uiTranslations';

export const KrushiHeroSection = ({ currentLang, onNavigate, isFarmerDashboard = false }) => {
  const t = getUiTranslation(currentLang);
  const tHero = t.hero || {};
  const tNav = t.nav || {};

  const handleSecondaryClick = () => {
    if (isFarmerDashboard) {
      const el = document.getElementById('farmer-workspace-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F382A] via-[#124232] to-[#0A261D] text-white pt-10 pb-16 lg:pt-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 shadow-sm text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="text-amber-400">★</span>
              <span>{tHero.badge || 'SIH 2026 · Problem ID 26131 · Maharashtra'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {tHero.headlineStart || 'Detect Crop Disease'}{' '}
              <span className="font-serif-display italic font-normal text-amber-300 underline decoration-amber-400/40 decoration-wavy">
                {tHero.headlineAccent || 'Before It Spreads.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
              {tHero.subtitle || 'An AI-powered platform for early detection and management of crop diseases and pest infestations — built for Indian farmers, extension workers, and agriculture officials.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('diagnosis')}
                className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center space-x-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Scan className="w-5 h-5 text-[#0A261D]" />
                <span>{tHero.scanCrop || tNav.scanCrop || 'Scan Your Crop'}</span>
              </button>

              <button
                onClick={handleSecondaryClick}
                className="bg-emerald-900/60 hover:bg-emerald-800/80 text-white border border-emerald-700/80 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 cursor-pointer backdrop-blur-sm"
              >
                <span>
                  {isFarmerDashboard
                    ? (tHero.viewFields || 'My Farm & Fields ↓')
                    : (tHero.viewDashboard || tNav.viewDashboard || 'View Dashboard')}
                </span>
                {isFarmerDashboard ? (
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>

            <div className="pt-5 border-t border-emerald-800/60 grid grid-cols-3 gap-2 sm:gap-6 text-[11px] sm:text-xs text-emerald-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-semibold text-white truncate">{tHero.statDiseases || '50+ crop diseases'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="font-semibold text-white truncate">{tHero.statLanguages || '11+ Indian languages'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span className="font-semibold text-white truncate">{tHero.statFarms || '340+ pilot farms'}</span>
              </div>
            </div>

          </div>

          {/* Right Hero Interactive Foliar Diagnostics Live Telemetry Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#0A261D] border-2 border-emerald-600/60 p-4 sm:p-5 shadow-2xl space-y-3.5">

              {/* HUD Top Bar */}
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800/80">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono">
                    {tHero.hudTitle || 'Foliar Diagnostics Live Stream'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-700 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>PyTorch EfficientNet-B0</span>
                </span>
              </div>

              {/* Viewfinder with Live Bounding Boxes & Scanning Reticle */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-emerald-500/50 shadow-inner group">
                <img
                  src="https://images.unsplash.com/photo-1592417817098-8f3d6ef23961?auto=format&fit=crop&w=700&q=80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="%230A261D"/><ellipse cx="300" cy="225" rx="220" ry="140" fill="%231E5638"/><path d="M120,225 C200,100 400,100 480,225 C400,350 200,350 120,225 Z" fill="%232D6A4F"/><ellipse cx="270" cy="200" rx="80" ry="55" fill="%234A2E18"/><ellipse cx="255" cy="190" rx="55" ry="35" fill="%231E120B"/><ellipse cx="340" cy="240" rx="40" ry="30" fill="%23E6A122" opacity="0.65"/><line x1="120" y1="225" x2="480" y2="225" stroke="%2352B788" stroke-width="3" stroke-dasharray="6,6"/></svg>';
                  }}
                  alt="Diseased Leaf Sample"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter contrast-110"
                />

                {/* Scanning Laser Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-[scan_2.5s_ease-in-out_infinite]" />

                {/* Illustrative Foliar Bounding Box 1 */}
                <div className="absolute top-[22%] left-[18%] w-[54%] h-[48%] border-2 rounded-lg border-rose-500 bg-rose-500/15 flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <div className="self-start px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-600 text-white shadow">
                    Phytophthora Late Blight [94.8%]
                  </div>
                  <div className="self-end px-1.5 py-0.2 rounded text-[8px] font-mono bg-black/80 text-emerald-300">
                    x:142 y:88 w:260 h:210
                  </div>
                </div>

                {/* Illustrative Foliar Bounding Box 2 */}
                <div className="absolute bottom-[12%] right-[10%] w-[32%] h-[28%] border-2 rounded-lg border-amber-400 bg-amber-400/15 flex items-start p-1 shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                  <span className="bg-amber-500 text-emerald-950 text-[9px] font-extrabold px-1 py-0.2 rounded">
                    Chlorosis Halo (89%)
                  </span>
                </div>

                {/* Bottom Telemetry Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-lg p-2 flex items-center justify-between text-xs text-white border border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[10px] text-emerald-200">RTSP Stream: 1080p WebGL</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">IP Cam & Drone Ready</span>
                </div>
              </div>

              {/* Quick Diagnostics Prescription */}
              <div className="bg-[#051811] rounded-xl p-3.5 border border-emerald-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    {tHero.hudPrescription || 'CIBRC Prescribed Active:'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900 text-purple-200 border border-purple-700">
                    {tHero.hudPhi || 'PHI: 7 Days'}
                  </span>
                </div>
                <p className="font-bold text-white text-sm">
                  Copper Oxychloride 50% WP @ 2.5 g/L
                </p>
                <p className="text-emerald-200/90 text-[11px]">
                  {tHero.hudSprayWindow || 'Spray Window: Next 18 Hours (Safe Weather)'}
                </p>
              </div>

              {/* Direct Action Trigger */}
              <button
                onClick={() => onNavigate('diagnosis')}
                className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-102 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-950" />
                <span>{tHero.launchCamera || 'Launch Foliar Live Camera & IP Drone Stream →'}</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
