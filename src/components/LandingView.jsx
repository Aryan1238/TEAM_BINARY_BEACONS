import React, { useState } from 'react';
import { 
  Scan,
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  CloudSun, 
  MapPin, 
  Users, 
  Languages, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Phone, 
  Check, 
  Zap, 
  Activity, 
  Layers, 
  Leaf 
} from 'lucide-react';
import { translations } from '../data/translations';

export const LandingView = ({ currentLang, onNavigate, onRoleChange }) => {
  const t = translations[currentLang] || translations.en;
  const [activeRoleTab, setActiveRoleTab] = useState('farmer');

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-slate-800">
      
      {/* 1. HERO SECTION (1:1 Figma Design Match) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F382A] via-[#124232] to-[#0A261D] text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 shadow-sm text-emerald-300 text-xs font-semibold tracking-wide">
                <span className="text-amber-400">★</span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                {t.hero.headlineStart}{' '}
                <span className="font-serif-display italic font-normal text-amber-300 underline decoration-amber-400/40 decoration-wavy">
                  {t.hero.headlineAccent}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('diagnosis')}
                  className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center space-x-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Scan className="w-5 h-5 text-[#0A261D]" />
                  <span>{t.nav.scanCrop}</span>
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-emerald-900/60 hover:bg-emerald-800/80 text-white border border-emerald-700/80 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 cursor-pointer backdrop-blur-sm"
                >
                  <span>{t.nav.viewDashboard}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-3 gap-3 sm:gap-6 text-xs text-emerald-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">{t.hero.statDiseases}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-semibold text-white">{t.hero.statLanguages}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-semibold text-white">{t.hero.statFarms}</span>
                </div>
              </div>

            </div>

            {/* Right Hero Interactive YOLO Live Vision Mockup Card */}
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
                      YOLOv8-Agri Live Stream
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-700 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>38.4 FPS · 12ms</span>
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
                  
                  {/* Real-time YOLO Bounding Box 1 */}
                  <div className="absolute top-[22%] left-[18%] w-[54%] h-[48%] border-2 rounded-lg border-rose-500 bg-rose-500/15 flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <div className="self-start px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-600 text-white shadow">
                      Phytophthora Late Blight [94.8%]
                    </div>
                    <div className="self-end px-1.5 py-0.2 rounded text-[8px] font-mono bg-black/80 text-emerald-300">
                      x:142 y:88 w:260 h:210
                    </div>
                  </div>

                  {/* Real-time YOLO Bounding Box 2 */}
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
                      CIBRC Prescribed Active:
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900 text-purple-200 border border-purple-700">
                      PHI: 7 Days
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm">
                    Copper Oxychloride 50% WP @ 2.5 g/L
                  </p>
                  <p className="text-emerald-200/90 text-[11px]">
                    Spray Window: <strong>Next 18 Hours (Safe Weather)</strong>
                  </p>
                </div>

                {/* Direct Action Trigger */}
                <button
                  onClick={() => onNavigate('diagnosis')}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-102 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-950" />
                  <span>Launch YOLO Live Camera & IP Drone Stream &rarr;</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-white border-y border-slate-200 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            <div className="px-4 py-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-rose-600 font-extrabold text-3xl sm:text-4xl">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
                <span>{t.metrics.stat1Val}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                {t.metrics.stat1Desc}
              </p>
            </div>

            <div className="px-4 py-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-amber-600 font-extrabold text-3xl sm:text-4xl">
                <TrendingDown className="w-7 h-7 text-amber-500" />
                <span>{t.metrics.stat2Val}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                {t.metrics.stat2Desc}
              </p>
            </div>

            <div className="px-4 py-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-emerald-700 font-extrabold text-3xl sm:text-4xl">
                <Sparkles className="w-7 h-7 text-emerald-600" />
                <span>{t.metrics.stat3Val}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                {t.metrics.stat3Desc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 6 PILLARS GRID */}
      <section className="py-20 bg-[#F8F9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.pillars.title}
            </h2>
            <p className="text-base text-slate-600 font-normal leading-relaxed">
              {t.pillars.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div 
              onClick={() => onNavigate('diagnosis')}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <Scan className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {t.pillars.p1Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {t.pillars.p1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p1Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>Launch Diagnostic Studio</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('weather')}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
                    <CloudSun className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                    {t.pillars.p2Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  {t.pillars.p2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p2Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
                <span>Check Outbreak Forecaster</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('hotspots')}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-700 group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                    {t.pillars.p3Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                  {t.pillars.p3Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p3Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-rose-700 group-hover:translate-x-1 transition-transform">
                <span>Explore Maharashtra Hotspots</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('dashboard')}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    {t.pillars.p4Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  {t.pillars.p4Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p4Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>View KVK Escalation Desk</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('ipm')}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
                    <Languages className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                    {t.pillars.p5Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
                  {t.pillars.p5Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p5Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-700 group-hover:translate-x-1 transition-transform">
                <span>Open CIBRC IPM Guide</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => {
                onRoleChange('govt');
                onNavigate('dashboard');
              }}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 border border-slate-300">
                    {t.pillars.p6Badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  {t.pillars.p6Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.pillars.p6Desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-800 group-hover:translate-x-1 transition-transform">
                <span>Access Command Dashboard</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PROCESS SECTION */}
      <section className="py-20 bg-[#0F382A] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 font-mono">
              {t.process.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.process.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="relative z-10 bg-[#0A261D] rounded-2xl p-6 border border-emerald-800 text-center space-y-4 shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-emerald-950 font-bold text-lg flex items-center justify-center shadow-md">
                {t.process.s1Num}
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.process.s1Title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {t.process.s1Desc}
              </p>
            </div>

            <div className="relative z-10 bg-[#0A261D] rounded-2xl p-6 border border-emerald-800 text-center space-y-4 shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-emerald-950 font-bold text-lg flex items-center justify-center shadow-md">
                {t.process.s2Num}
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.process.s2Title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {t.process.s2Desc}
              </p>
            </div>

            <div className="relative z-10 bg-[#0A261D] rounded-2xl p-6 border border-emerald-800 text-center space-y-4 shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-emerald-950 font-bold text-lg flex items-center justify-center shadow-md">
                {t.process.s3Num}
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.process.s3Title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {t.process.s3Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ROLES SECTION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.roles.title}
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              {t.roles.subtitle}
            </p>

            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 mt-6 shadow-inner">
              <button
                onClick={() => setActiveRoleTab('farmer')}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'farmer' 
                    ? 'bg-[#0F382A] text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌾 {t.roles.tabFarmer}
              </button>
              <button
                onClick={() => setActiveRoleTab('officer')}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'officer' 
                    ? 'bg-[#0F382A] text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧑‍🌾 {t.roles.tabOfficer}
              </button>
              <button
                onClick={() => setActiveRoleTab('govt')}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'govt' 
                    ? 'bg-[#0F382A] text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏛️ {t.roles.tabGovt}
              </button>
            </div>
          </div>

          <div className="bg-[#F8F9F5] rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            
            {activeRoleTab === 'farmer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                    {t.roles.farmerTag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {t.roles.farmerTitle}
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.farmerF1}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.farmerF2}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.farmerF3}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        onRoleChange('farmer');
                        onNavigate('dashboard');
                      }}
                      className="bg-[#0F382A] hover:bg-[#164E3A] text-white px-6 py-3 rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Open Farmer Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
                    <img 
                      src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=700&q=80" 
                      alt="Indian Farmer in field" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-medium">
                        Nashik District Pilot Farmer · 2.5 Acre Vineyard & Tomato Plot
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'officer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest font-mono">
                    {t.roles.officerTag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {t.roles.officerTitle}
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.officerF1}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.officerF2}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.officerF3}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        onRoleChange('officer');
                        onNavigate('dashboard');
                      }}
                      className="bg-[#0F382A] hover:bg-[#164E3A] text-white px-6 py-3 rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Open Extension Worker Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
                    <img 
                      src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80" 
                      alt="Agronomist field inspection" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-medium">
                        KVK Field Officer · Geo-Tagged Diagnostic Inspection
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'govt' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest font-mono">
                    {t.roles.govtTag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {t.roles.govtTitle}
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.govtF1}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.govtF2}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{t.roles.govtF3}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        onRoleChange('govt');
                        onNavigate('dashboard');
                      }}
                      className="bg-[#0F382A] hover:bg-[#164E3A] text-white px-6 py-3 rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Open Agriculture Command Center</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80" 
                      alt="Government Command Analytics" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-medium">
                        Maharashtra State Agriculture Epidemiology Command Center
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 6. PILOT IMPACT SECTION */}
      <section className="py-20 bg-[#F8F9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-mono">
              {t.pilot.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.pilot.title}
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              {t.pilot.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-10">
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block">
                  {t.pilot.kpi1Val}
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  {t.pilot.kpi1Label}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium font-mono">
                  {t.pilot.kpi1Change}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 block">
                  {t.pilot.kpi2Val}
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  {t.pilot.kpi2Label}
                </span>
                <span className="text-[11px] text-blue-700 font-medium font-mono">
                  {t.pilot.kpi2Change}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 block">
                  {t.pilot.kpi3Val}
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  {t.pilot.kpi3Label}
                </span>
                <span className="text-[11px] text-amber-700 font-medium font-mono">
                  {t.pilot.kpi3Change}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
                  {t.pilot.kpi4Val}
                </span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  {t.pilot.kpi4Label}
                </span>
                <span className="text-[11px] text-slate-600 font-medium font-mono">
                  {t.pilot.kpi4Change}
                </span>
              </div>

            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800">Pilot Trend (Cases Detected vs Crop Loss Index)</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-700" />
                    <span className="text-slate-600">Cases Detected (Monthly)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-slate-600">Crop Loss Score (Index / 100)</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-48 sm:h-64 bg-slate-50 rounded-xl p-4 relative overflow-hidden border border-slate-200/80 flex items-end">
                <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" />

                  <path
                    d="M 20 50 Q 120 70 200 110 T 400 150 T 580 165"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 20 180 Q 120 160 200 120 T 400 65 T 580 35"
                    fill="none"
                    stroke="#0F382A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  <circle cx="20" cy="50" r="4" fill="#F59E0B" />
                  <circle cx="200" cy="110" r="4" fill="#F59E0B" />
                  <circle cx="400" cy="150" r="4" fill="#F59E0B" />
                  <circle cx="580" cy="165" r="4" fill="#F59E0B" />

                  <circle cx="20" cy="180" r="4" fill="#0F382A" />
                  <circle cx="200" cy="120" r="4" fill="#0F382A" />
                  <circle cx="400" cy="65" r="4" fill="#0F382A" />
                  <circle cx="580" cy="35" r="4" fill="#0F382A" />
                </svg>

                <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-16 bg-[#0A261D] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {t.cta.badge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.cta.title}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center space-x-2 cursor-pointer transform hover:scale-105"
            >
              <Scan className="w-5 h-5" />
              <span>{t.cta.btnDownload}</span>
            </button>

            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{t.cta.btnHelpline}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#05150F] text-emerald-300/80 py-12 border-t border-emerald-950 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-white">KrushiRaksha (कृषीरक्षा)</span>
            </div>
            <p className="text-xs text-emerald-200/70 max-w-md leading-relaxed">
              An initiative under the Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship & Innovation. Built for Smart India Hackathon 2024 · Problem Statement ID: 26131.
            </p>
            <p className="text-[11px] text-emerald-400 font-mono">
              Ground-Truth Datasets: PlantVillage (Kaggle), IP102 Benchmark, CIBRC/ICAR Schedules, Maharashtra Open GIS.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">Platform</span>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => onNavigate('diagnosis')} className="hover:text-white cursor-pointer">Disease Detection</button></li>
              <li><button onClick={() => onNavigate('weather')} className="hover:text-white cursor-pointer">Weather Forecasting</button></li>
              <li><button onClick={() => onNavigate('hotspots')} className="hover:text-white cursor-pointer">Hotspot Maps</button></li>
              <li><button onClick={() => onNavigate('ipm')} className="hover:text-white cursor-pointer">CIBRC Dosage</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">Official Command</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">Support & Help</span>
            <ul className="space-y-1.5 text-xs">
              <li><span>Toll-Free Helpline: 1800-KRUSHI</span></li>
              <li><span>KVK WhatsApp: +91 94220 12345</span></li>
              <li><span>Govt of Maharashtra Agriculture Desk</span></li>
              <li><span className="text-amber-400">Offline SMS: Text CROP to 56161</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/60">
          <p>© 2024–2026 KrushiRaksha. Government of Maharashtra Initiative. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">SIH 2024 · Problem ID 26131 · Agriculture, FoodTech & Rural Development</p>
        </div>
      </footer>

    </div>
  );
};

