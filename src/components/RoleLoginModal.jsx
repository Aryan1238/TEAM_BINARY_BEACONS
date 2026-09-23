import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, X, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_CREDENTIALS, authenticateRole } from '../config/authCredentials';

export const RoleLoginModal = ({
  isOpen,
  targetRole, // 'farmer' | 'officer' | 'govt'
  onSuccess,
  onClose
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creds = DEMO_CREDENTIALS[targetRole?.toLowerCase()] || DEMO_CREDENTIALS.farmer;

  // Reset inputs and errors when modal opens or targetRole changes
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = authenticateRole(targetRole, username, password);

    if (result.success) {
      setIsSubmitting(false);
      onSuccess?.(targetRole);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.message || 'Invalid credentials');
    }
  };

  const handleQuickFill = () => {
    setUsername(creds.username);
    setPassword(creds.password);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#071F17] border border-emerald-700/80 rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-emerald-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-900/80 border border-emerald-600/60 flex items-center justify-center text-2xl shadow-inner">
              {creds.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white tracking-tight">
                  {creds.label} Sign In
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-emerald-950">
                  Demo
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-medium">
                {creds.dashboardTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Subtitle / Context */}
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            {creds.description}. Enter role credentials below to access this workspace.
          </p>

          {/* Quick Demo Credential Tip Strip */}
          <div className="flex items-center justify-between bg-emerald-950/90 border border-amber-400/40 rounded-xl px-3.5 py-2">
            <div className="text-[11px] text-amber-200">
              <span className="font-semibold text-amber-300">Demo Account:</span>{' '}
              <span className="font-mono text-white font-bold">{creds.username}</span> /{' '}
              <span className="font-mono text-white font-bold">{creds.password}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer underline decoration-dotted ml-2 shrink-0"
              title="Click to auto-populate credentials"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Fill</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-semibold animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username Field with visible placeholder */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={creds.username}
                  className="w-full pl-9 pr-3 py-2 bg-[#0A291E] border border-emerald-700/80 rounded-xl text-xs text-white placeholder-emerald-400/70 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field with visible placeholder */}
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={creds.password}
                  className="w-full pl-9 pr-3 py-2 bg-[#0A291E] border border-emerald-700/80 rounded-xl text-xs text-white placeholder-emerald-400/70 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-emerald-950 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-950" />
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-950 ml-0.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-2.5 bg-[#051812] border-t border-emerald-900 text-center">
          <p className="text-[10px] text-emerald-400/80">
            Client-side authenticated for this session · Resets on browser close
          </p>
        </div>
      </div>
    </div>
  );
};
