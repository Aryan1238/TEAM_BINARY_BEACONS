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
  Radio,
  Sparkles
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
    { id: 'landing', label: 'Home', icon: Sprout },
    { id: 'diagnosis', label: 'AI Diagnosis & YOLO', icon: Camera, highlight: true },
    { id: 'weather', label: 'Weather Risk', icon: CloudRain },
    { id: 'hotspots', label: 'Hotspot GIS', icon: MapPin },
    { id: 'ipm', label: 'CIBRC Dosage', icon: Calculator },
    { id: 'dashboard', label: 'Role Hub', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F382A] border-b border-emerald-800/90 text-white shadow-xl">
      {/* Top SIH Micro-Bar */}
      <div className="bg-[#071F17] text-emerald-300/90 text-[11px] py-1 px-3 sm:px-6 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.2 rounded text-[10px] font-extrabold bg-amber-400 text-emerald-950 shadow-sm">
              SIH 2024
            </span>
            <span className="truncate text-emerald-200 text-[11px]">
              Problem ID 26131 · Govt of Maharashtra State Innovation Society
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button 
              onClick={onOpenSmsSim}
              className="hover:text-amber-300 transition-colors flex items-center space-x-1.5 cursor-pointer bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800"
            >
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span>Offline 2G SMS / IVR</span>
            </button>
            <span className="text-emerald-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center space-x-1 text-emerald-200 font-mono">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>1800-KRUSHI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar: Logo, Navigation Pills, Roles & YOLO Action */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
          
          {/* LEFT: Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 group py-1"
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
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-emerald-950">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-emerald-300 -mt-0.5 font-medium">
                Crop Health & Outbreak GIS
              </p>
            </div>
          </div>

          {/* CENTER: Navigation Links (Always Visible on Desktop & Laptop at all Zoom Levels) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-emerald-700 text-amber-300 shadow-md border border-emerald-500' 
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Role Switcher, Language & YOLO Button */}
          <div className="flex items-center space-x-2 shrink-0 ml-auto lg:ml-0">
            
            {/* Role Switcher */}
            <div className="hidden sm:flex bg-[#071F17] p-0.5 rounded-xl border border-emerald-800 items-center shrink-0">
              <button
                onClick={() => onRoleChange('farmer')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'farmer' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => onRoleChange('officer')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'officer' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                🧑‍🌾 Officer
              </button>
              <button
                onClick={() => onRoleChange('govt')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'govt' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                🏛️ Govt
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-[#071F17] rounded-xl border border-emerald-800 px-2 py-1 text-xs shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-emerald-200 text-xs font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-[#0F382A] text-white">EN</option>
                <option value="mr" className="bg-[#0F382A] text-white">मराठी</option>
                <option value="hi" className="bg-[#0F382A] text-white">हिंदी</option>
              </select>
            </div>

            {/* Primary Action Button: YOLO Live Vision */}
            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 transform hover:scale-102 active:scale-98"
            >
              <Camera className="w-4 h-4 text-emerald-950" />
              <span className="whitespace-nowrap">YOLO Live Vision</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-emerald-200 hover:text-white rounded-xl hover:bg-emerald-900 border border-emerald-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown (Below md) */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-3 border-t border-emerald-800 space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-1.5 pb-2">
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
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                      isActive 
                        ? 'bg-emerald-700 text-amber-300' 
                        : 'bg-emerald-950/80 text-emerald-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Role Switcher */}
            <div className="flex bg-[#071F17] p-1 rounded-xl border border-emerald-800 justify-between">
              <button
                onClick={() => {
                  onRoleChange('farmer');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'farmer' ? 'bg-emerald-700 text-white' : 'text-emerald-300'
                }`}
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => {
                  onRoleChange('officer');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'officer' ? 'bg-emerald-700 text-white' : 'text-emerald-300'
                }`}
              >
                🧑‍🌾 Officer
              </button>
              <button
                onClick={() => {
                  onRoleChange('govt');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center ${
                  currentRole === 'govt' ? 'bg-emerald-700 text-white' : 'text-emerald-300'
                }`}
              >
                🏛️ Govt
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
