import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  ShieldCheck, 
  PhoneCall, 
  Smartphone, 
  CloudRain, 
  MapPin, 
  Calculator, 
  UserCheck, 
  Menu, 
  X,
  Scan,
  LayoutDashboard,
  Cpu,
  Camera,
  Radio
} from 'lucide-react';
import { translations } from '../data/translations';

export const Navbar = ({ 
  currentLang, 
  onLangChange, 
  currentRole, 
  onRoleChange, 
  activeView, 
  onNavigate,
  onOpenSmsSim 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sprout },
    { id: 'diagnosis', label: 'YOLO Vision AI', icon: Camera, badge: 'Live P1', highlight: true },
    { id: 'weather', label: 'Weather Risk', icon: CloudRain, badge: 'P2' },
    { id: 'hotspots', label: 'Hotspots GIS', icon: MapPin, badge: 'P3' },
    { id: 'ipm', label: 'CIBRC Dosage', icon: Calculator, badge: 'P4' },
    { id: 'dashboard', label: 'Role Studio', icon: LayoutDashboard, badge: 'P5' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F382A]/95 backdrop-blur-md border-b border-emerald-800/80 text-white shadow-xl">
      {/* Top SIH 26131 Micro-Ticker */}
      <div className="bg-[#0A261D] text-emerald-300/90 text-[11px] py-1 px-4 border-b border-emerald-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-flex items-center px-2 py-0.2 rounded text-[10px] font-extrabold bg-amber-400 text-emerald-950 shadow-sm">
              SIH 2024
            </span>
            <span className="truncate hidden sm:inline font-mono">
              Problem ID 26131 · Govt of Maharashtra State Innovation Society
            </span>
            <span className="sm:hidden font-mono">SIH ID 26131</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button 
              onClick={onOpenSmsSim}
              className="hover:text-amber-300 transition-colors flex items-center space-x-1.5 cursor-pointer bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60"
            >
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span>Offline SMS / IVR</span>
            </button>
            <span className="text-emerald-700 hidden md:inline">|</span>
            <div className="hidden md:flex items-center space-x-1 text-emerald-200">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>1800-KRUSHI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* LEFT: Logo & Brand */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-emerald-700 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0F382A] rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-amber-400 transform group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  KrushiRaksha
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80 -mt-0.5 font-medium hidden sm:block">
                Crop Health & Outbreak GIS
              </p>
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-emerald-800/90 text-amber-300 shadow-inner border border-emerald-600' 
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive 
                        ? 'bg-amber-400 text-emerald-950' 
                        : item.highlight 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT TOOLS: Role Switcher, Language & Scan Button */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            
            {/* Role Switcher Pill */}
            <div className="hidden sm:flex bg-[#0A261D] p-0.5 rounded-lg border border-emerald-800 items-center shrink-0">
              <button
                onClick={() => onRoleChange('farmer')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  currentRole === 'farmer' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Farmer Interface"
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => onRoleChange('officer')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  currentRole === 'officer' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Extension Officer Interface"
              >
                🧑‍🌾 Officer
              </button>
              <button
                onClick={() => onRoleChange('govt')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  currentRole === 'govt' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Govt Command Center"
              >
                🏛️ Govt
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-[#0A261D] rounded-lg border border-emerald-800 px-2 py-1 text-xs shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-emerald-100 text-[11px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#0F382A] text-white">EN</option>
                <option value="mr" className="bg-[#0F382A] text-white">मराठी</option>
                <option value="hi" className="bg-[#0F382A] text-white">हिंदी</option>
              </select>
            </div>

            {/* YOLO Live Camera CTA Button (Properly Aligned & Padded) */}
            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs shadow-lg hover:shadow-amber-400/25 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 border border-amber-300/60"
            >
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping mr-0.5" />
              <Camera className="w-4 h-4 text-emerald-950 shrink-0" />
              <span className="whitespace-nowrap font-sans tracking-tight">YOLO Live Vision</span>
            </button>

            {/* Mobile Menu Trigger */}
            <div className="flex xl:hidden items-center ml-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-emerald-900/80 border border-emerald-800 text-emerald-200 hover:text-white focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A261D] border-b border-emerald-800 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 text-left transition-all ${
                    isActive ? 'bg-emerald-800 text-amber-300 border border-emerald-700' : 'bg-emerald-900/40 text-emerald-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-emerald-800/80 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span className="font-semibold">Switch Persona:</span>
              <div className="flex space-x-1">
                {['farmer', 'officer', 'govt'].map(r => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize font-bold transition-all ${
                      currentRole === r ? 'bg-amber-400 text-emerald-950 shadow' : 'bg-emerald-900 text-emerald-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSmsSim();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Offline 2G SMS & IVR Simulator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
