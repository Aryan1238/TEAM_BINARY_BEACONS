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
  Cpu
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
    { id: 'landing', label: t.nav.features, icon: Sprout },
    { id: 'diagnosis', label: 'AI Diagnostic Studio', icon: Scan, badge: 'Pillar 1' },
    { id: 'weather', label: 'Weather Risk', icon: CloudRain, badge: 'Pillar 2' },
    { id: 'hotspots', label: 'Hotspot Maps', icon: MapPin, badge: 'Pillar 3' },
    { id: 'ipm', label: 'CIBRC Dosage', icon: Calculator, badge: 'Pillar 4' },
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard, badge: 'Pillar 5' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F382A]/95 backdrop-blur-md border-b border-emerald-800/60 text-white shadow-lg">
      {/* Top micro-bar for SIH details */}
      <div className="bg-[#0A261D] text-emerald-300/90 text-xs py-1 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              SIH 2024
            </span>
            <span className="truncate">Problem ID: 26131 · Maharashtra State Innovation Society · Dept of Skills & Innovation</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-[11px]">
            <button 
              onClick={onOpenSmsSim}
              className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span>{t.nav.offlineMode} (SMS / USSD)</span>
            </button>
            <span className="text-emerald-700">|</span>
            <div className="flex items-center space-x-1 text-emerald-200">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>{t.nav.helpline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0F382A] rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400 transform group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center space-x-1">
                <span>{t.nav.brand}</span>
                <span className="text-amber-400 text-xs font-serif font-normal italic px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">AI</span>
              </span>
              <p className="text-[10px] text-emerald-300/80 -mt-1 font-medium hidden sm:block">
                {t.nav.tagline}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700/80' 
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isActive ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Role Switcher, Language Switcher, CTA */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Role Switcher Pill */}
            <div className="bg-[#0A261D] p-0.5 rounded-lg border border-emerald-800 flex items-center">
              <button
                onClick={() => onRoleChange('farmer')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  currentRole === 'farmer' 
                    ? 'bg-emerald-700 text-white font-semibold shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Farmer Interface"
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => onRoleChange('officer')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  currentRole === 'officer' 
                    ? 'bg-emerald-700 text-white font-semibold shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Extension Officer Interface"
              >
                🧑‍🌾 Officer
              </button>
              <button
                onClick={() => onRoleChange('govt')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  currentRole === 'govt' 
                    ? 'bg-emerald-700 text-white font-semibold shadow-sm' 
                    : 'text-emerald-300/80 hover:text-white'
                }`}
                title="Govt Command Center"
              >
                🏛️ Govt
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-[#0A261D] rounded-lg border border-emerald-800 px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-emerald-100 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-[#0F382A] text-white">English</option>
                <option value="mr" className="bg-[#0F382A] text-white">मराठी (Marathi)</option>
                <option value="hi" className="bg-[#0F382A] text-white">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Scan Crop Button */}
            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-950" />
              <span>{t.nav.scanCrop}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A261D] border-b border-emerald-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 text-left ${
                    activeView === item.id ? 'bg-emerald-800 text-amber-300' : 'bg-emerald-900/40 text-emerald-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-emerald-800/80 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span>{t.nav.role}:</span>
              <div className="flex space-x-1">
                {['farmer', 'officer', 'govt'].map(r => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`px-2 py-1 rounded text-xs capitalize ${
                      currentRole === r ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-900 text-emerald-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-300 pt-1">
              <span>Language:</span>
              <div className="flex space-x-1">
                {[['en', 'EN'], ['mr', 'मराठी'], ['hi', 'हिंदी']].map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => onLangChange(code)}
                    className={`px-2 py-1 rounded text-xs ${
                      currentLang === code ? 'bg-amber-500 text-emerald-950 font-bold' : 'bg-emerald-900 text-emerald-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSmsSim();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2 bg-emerald-900 text-amber-300 rounded-lg text-xs font-medium flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Offline SMS & IVR Simulator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
