import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  FlaskConical, 
  Send, 
  Mic, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  FileText,
  Calendar,
  Check,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExtensionOfficerDashboard = ({ currentLang, onNavigate }) => {
  const [cases, setCases] = useState([
    {
      id: 'MH-NSK-201',
      farmer: 'Prakash Gaikwad',
      village: 'Niphad Shivar, Plot 4',
      crop: 'Cotton (Bt Cotton)',
      aiPrediction: 'Pink Bollworm (94% confidence)',
      reportedTrapCount: '14 moths / trap / night',
      status: 'Pending Field Verification',
      verified: false
    },
    {
      id: 'MH-NSK-202',
      farmer: 'Sunita More',
      village: 'Dindori Khurd, Plot 2',
      crop: 'Tomato',
      aiPrediction: 'Early Late Blight (88% confidence)',
      reportedTrapCount: 'Foliage Spotting S2',
      status: 'Pending Field Verification',
      verified: false
    },
    {
      id: 'MH-NSK-198',
      farmer: 'Balasaheb Thorat',
      village: 'Satana Road, Plot 7',
      crop: 'Pomegranate',
      aiPrediction: 'Bacterial Blight / Telya',
      reportedTrapCount: 'Cracked Twigs',
      status: 'Verified & Prescribed',
      verified: true
    }
  ]);

  const [broadcastText, setBroadcastText] = useState('शेतकरी बांधवांनो, निफाड परिसरात करपा रोगाचा प्रादुर्भाव आढळला आहे. तात्काळ कॉपर ऑक्सीक्लोराईड २५ ग्रॅम प्रति पंप फवारणी करा.');
  const [sentAudio, setSentAudio] = useState(false);

  const handleVerifyCase = (id, confirmed) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: confirmed ? 'Confirmed Ground-Truth' : 'Corrected (False Positive)',
          verified: true
        };
      }
      return c;
    }));

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleSendVoiceBroadcast = () => {
    setSentAudio(true);
    setTimeout(() => setSentAudio(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950">
                Extension Officer Field Workspace (कृषी सहाय्यक)
              </span>
              <span className="text-xs text-emerald-300 font-mono">Nashik Division · Sub-District Niphad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Extension Officer: Dilip Shinde (दिलीप शिंदे)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Supervising 28 Village Clusters · 420 Active Farmers · 2 Pending Ground-Truth Validations Today
            </p>
          </div>

          <div className="bg-[#0A261D] rounded-xl p-4 border border-emerald-800 shrink-0 text-xs space-y-1.5">
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">Ground Validations:</span>
              <span className="font-bold text-amber-400 font-mono">94 / 102 (92%)</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">AI Agreement Rate:</span>
              <span className="font-bold text-emerald-400 font-mono">96.8%</span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: Ground-Truth Verification Queue */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base font-bold text-slate-900">
                    Active Ground-Truth Verification Queue
                  </h2>
                </div>
                <span className="text-xs text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded">
                  Human-in-the-Loop Active Learning
                </span>
              </div>

              <div className="space-y-4">
                {cases.map((c) => (
                  <div 
                    key={c.id}
                    className={`p-4 rounded-xl border space-y-3 transition-all ${
                      c.verified ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-emerald-50/40 border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{c.id}</span>
                          <span className="font-extrabold text-sm text-slate-900">{c.farmer}</span>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.village} · Crop: <strong>{c.crop}</strong></span>
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.verified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-emerald-950 animate-pulse'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">AI Vision / Trap Prediction:</span>
                        <span className="font-bold text-slate-900">{c.aiPrediction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sensor / Trap Ingestion:</span>
                        <span className="font-mono text-rose-600 font-bold">{c.reportedTrapCount}</span>
                      </div>
                    </div>

                    {!c.verified ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyCase(c.id, true)}
                          className="px-3.5 py-1.5 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-lg text-xs font-bold transition-all shadow flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Confirm Diagnosis</span>
                        </button>

                        <button
                          onClick={() => handleVerifyCase(c.id, false)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span>False Positive / Correct</span>
                        </button>

                        <button
                          onClick={() => alert(`Lab sample requisition dispatch created for ${c.farmer}. Barcode generated: MH-LAB-${Date.now().toString().slice(-6)}`)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Dispatch Lab Sample</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-800 font-medium flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ground-truth logged and fed into active retraining pipeline.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Field Route & Audio Broadcast Tool */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Field Visit Route Planner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Today&apos;s Field Inspection Route</h3>
                </div>
                <span className="text-xs text-blue-700 font-mono font-bold">4 Farms · 18 km</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Prakash Gaikwad (Niphad Shivar)</span>
                    <span className="text-slate-500">Cotton pink bollworm trap check · 09:30 AM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Sunita More (Dindori Khurd)</span>
                    <span className="text-slate-500">Tomato blight foliar inspection · 11:15 AM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Ramesh Patil (Pimpalgaon)</span>
                    <span className="text-slate-500">Grape vineyard follow-up · 02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Cluster Audio Broadcast Dispatch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Mic className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Cluster Voice / SMS Advisory Dispatch
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Broadcast Advisory to 85 Niphad Farmers:
                </label>
                <textarea
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSendVoiceBroadcast}
                className="w-full py-2.5 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Dispatch Voice & SMS Advisory to Cluster</span>
              </button>

              {sentAudio && (
                <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Advisory message successfully broadcasted to 85 registered mobile phones.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

