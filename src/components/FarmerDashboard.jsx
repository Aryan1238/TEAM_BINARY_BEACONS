import React, { useState } from 'react';
import { 
  Sprout, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Scan, 
  UserCheck, 
  MapPin, 
  ChevronRight, 
  Phone, 
  Droplets, 
  Plus, 
  Check,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FarmerDashboard = ({ currentLang, onNavigate }) => {
  const [sprayDone, setSprayDone] = useState(false);

  const handleMarkSprayDone = () => {
    setSprayDone(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0F382A', '#10B981', '#E6A122']
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
                Farmer Workspace (शेतकरी डॅशबोर्ड)
              </span>
              <span className="text-xs text-emerald-300 font-mono">Nashik District · Niphad Taluka</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, Ramesh Patil (रमेश पाटील)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Managing 2 Active Plots (2.5 Acres Total) · Soil Health Card Valid · Extension Officer: Dilip Shinde
            </p>
          </div>

          <button
            onClick={() => onNavigate('diagnosis')}
            className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-6 py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Diseased Leaf</span>
          </button>
        </div>

        {/* 2-Column Farmer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: Active Plots & Spray Reminders */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* My Plots Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base font-bold text-slate-900">My Registered Plots</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">2 Active Plots</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plot 1 */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Plot A: Vineyard</span>
                      <span className="text-[11px] text-slate-500">Thompson Seedless Grapes · 1.5 Acre</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      Downy Mildew Alert
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Crop Stage:</span>
                      <span className="font-bold text-slate-800">Berry Development (65 DAP)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Spray:</span>
                      <span className="font-mono">3 days ago (Bordeaux 1%)</span>
                    </div>
                  </div>
                </div>

                {/* Plot 2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Plot B: Tomato Field</span>
                      <span className="text-[11px] text-slate-500">Abhinav Hybrid · 1.0 Acre</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Healthy
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Crop Stage:</span>
                      <span className="font-bold text-slate-800">Flowering & Fruit Set</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Spray:</span>
                      <span className="font-mono">7 days ago (Neem Oil)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spray Schedule & Today's Reminder */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Prescribed Treatment & Spray Reminders
                  </h2>
                </div>
                <span className="text-[11px] text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded">
                  1 Task Pending
                </span>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                sprayDone 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-amber-50/60 border-amber-200 text-amber-950'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-xs">Due Today (Tuesday Morning 07:00 AM)</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Plot A (Grapes): Copper Oxychloride 50% WP (37.5g / 15L Tank)
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Preventive cover spray against Downy Mildew sporulation. Rain expected in 48 hours.
                    </p>
                  </div>

                  <button
                    onClick={handleMarkSprayDone}
                    disabled={sprayDone}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      sprayDone 
                        ? 'bg-emerald-600 text-white cursor-default' 
                        : 'bg-[#0F382A] hover:bg-[#164E3A] text-white shadow'
                    }`}
                  >
                    {sprayDone ? '✓ Completed' : 'Mark as Sprayed'}
                  </button>
                </div>
              </div>

              {/* Diagnosis History List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Past Scans & Ground Validations:
                </span>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Tomato Late Blight (करपा)</span>
                      <span className="text-[11px] text-slate-500 block">Scanned on 20 Aug · 94% Confidence</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Resolved
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Healthy Control Check</span>
                      <span className="text-[11px] text-slate-500 block">Scanned on 12 Aug · Grade S0</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      Archived
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: KVK Agronomist Status & Extension Contact */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* KVK Ticket Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-slate-900">KVK Expert Consultation Desk</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 font-mono">
                  #KVK-NSK-492
                </span>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Assigned Agronomist:</span>
                  <span className="font-bold text-slate-900">Dr. S. Kulkarni (KVK Nashik)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verification Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    Diagnosis Confirmed
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-700 leading-relaxed italic">
                  &ldquo;Symptoms on Plot A confirm early Plasmopara viticola. Maintain 1% Bordeaux mixture schedule and avoid overhead irrigation.&rdquo;
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500">Need emergency assistance?</span>
                <a 
                  href="tel:1800578744" 
                  className="text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call KVK Helpline</span>
                </a>
              </div>
            </div>

            {/* Extension Worker Connect Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Assigned Extension Worker (कृषी सहाय्यक):
              </span>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center">
                  DS
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-900 block">Dilip Shinde</span>
                  <span className="text-slate-500">Niphad Block Extension Officer</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  Active in Field
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => alert('Extension Officer Dilip Shinde has been notified. He is scheduled to visit your plot on Thursday.')}
                  className="py-2.5 bg-[#0F382A] text-white rounded-xl font-bold hover:bg-[#164E3A] transition-colors cursor-pointer text-center"
                >
                  Request Field Visit
                </button>
                <button
                  onClick={() => alert('Opening voice advisory message in Marathi...')}
                  className="py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-colors cursor-pointer text-center"
                >
                  Audio Advisory
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

