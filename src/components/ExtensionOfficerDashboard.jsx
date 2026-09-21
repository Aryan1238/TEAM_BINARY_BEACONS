import React, { useState, useMemo } from 'react';
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
  Filter,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDiagnosis } from '../context/DiagnosisContext';
import { getPriorityStyles } from '../services/priorityEngine';

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, WATCH: 3 };

export const ExtensionOfficerDashboard = ({ currentLang, onNavigate, onRoleChange }) => {
  const { officerCases, updateOfficerCaseStatus, setSelectedDisease } = useDiagnosis();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'critical' | 'high' | 'pending' | 'live'
  const [broadcastText, setBroadcastText] = useState('शेतकरी बांधवांनो, निफाड परिसरात करपा रोगाचा प्रादुर्भाव आढळला आहे. तात्काळ कॉपर ऑक्सीक्लोराईड २५ ग्रॅम प्रति पंप फवारणी करा.');
  const [sentAudio, setSentAudio] = useState(false);
  const [expandedReasonsId, setExpandedReasonsId] = useState(null);

  // Automatic sorting: CRITICAL -> HIGH -> MEDIUM -> WATCH, then highest score / newest first
  const sortedCases = useMemo(() => {
    return [...officerCases].sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority] ?? 4;
      const pB = PRIORITY_ORDER[b.priority] ?? 4;
      if (pA !== pB) return pA - pB;
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    });
  }, [officerCases]);

  // Section metrics
  const criticalCount = sortedCases.filter(c => c.priority === 'CRITICAL').length;
  const highCount = sortedCases.filter(c => c.priority === 'HIGH').length;
  const pendingCount = sortedCases.filter(c => !c.verified).length;
  const liveCount = sortedCases.filter(c => c.source === 'live_backend').length;

  const filteredCases = useMemo(() => {
    if (activeTab === 'critical') return sortedCases.filter(c => c.priority === 'CRITICAL');
    if (activeTab === 'high') return sortedCases.filter(c => c.priority === 'HIGH');
    if (activeTab === 'pending') return sortedCases.filter(c => !c.verified);
    if (activeTab === 'live') return sortedCases.filter(c => c.source === 'live_backend');
    return sortedCases;
  }, [sortedCases, activeTab]);

  const handleVerifyCase = (id, confirmed) => {
    updateOfficerCaseStatus(id, confirmed);
    if (confirmed) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleSendVoiceBroadcast = () => {
    setSentAudio(true);
    setTimeout(() => setSentAudio(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome Header */}
        <div className="bg-[#0F382A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
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
              Supervising 28 Village Clusters · 420 Active Farmers · {pendingCount} Pending Ground-Truth Validations
            </p>
          </div>

          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 text-xs space-y-2 min-w-[220px]">
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">Live AI Diagnoses:</span>
              <span className="font-bold text-emerald-400 font-mono">{liveCount} Ingested</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">Critical / High:</span>
              <span className="font-bold text-rose-400 font-mono">{criticalCount + highCount} Plots</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">Pending Verification:</span>
              <span className="font-bold text-amber-400 font-mono">{pendingCount} Cases</span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ========================================================= */}
          {/* LEFT: Prioritized Ground-Truth Verification Queue */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">

              {/* Header & Tabs */}
              <div className="pb-3 border-b border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                    <h2 className="text-base font-bold text-slate-900">
                      Prioritized Verification Queue
                    </h2>
                  </div>
                  <span className="text-xs text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded self-start sm:self-auto">
                    Human-in-the-Loop Active Learning
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-[#0F382A] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Cases ({sortedCases.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('critical')}
                    className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'critical'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    Critical ({criticalCount})
                  </button>

                  <button
                    onClick={() => setActiveTab('high')}
                    className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'high'
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    High Priority ({highCount})
                  </button>

                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    Pending ({pendingCount})
                  </button>

                  <button
                    onClick={() => setActiveTab('live')}
                    className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'live'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    Live AI ({liveCount})
                  </button>
                </div>
              </div>

              {/* Cases List */}
              <div className="space-y-4">
                {filteredCases.map((c) => {
                  const pStyle = getPriorityStyles(c.priority);
                  const isExpanded = expandedReasonsId === c.id;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
                        c.verified
                          ? 'bg-slate-50/80 border-slate-200 opacity-80'
                          : c.priority === 'CRITICAL'
                          ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                          : c.priority === 'HIGH'
                          ? 'bg-orange-50/40 border-orange-200 shadow-xs'
                          : 'bg-emerald-50/30 border-emerald-200 shadow-xs'
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-500">{c.id}</span>
                            <span className="font-extrabold text-sm sm:text-base text-slate-900">{c.farmer}</span>

                            {/* Source Badge */}
                            {c.source === 'live_backend' ? (
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white font-mono uppercase">
                                LIVE BACKEND
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-mono uppercase">
                                BASELINE DEMO
                              </span>
                            )}
                          </div>

                          <span className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.village || c.field} · Plot: <strong>{c.crop}</strong></span>
                          </span>
                        </div>

                        {/* Priority pill */}
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pStyle.badge}`}>
                            {c.priority || 'WATCH'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Evidence data row */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Pathology Diagnosis:</span>
                          <span className="font-bold text-slate-900">{c.disease}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">PyTorch Confidence:</span>
                          <span className="font-mono text-emerald-700 font-bold">
                            {c.confidence ? `${Math.round(c.confidence)}%` : 'Verified Specimen'}
                          </span>
                        </div>
                        {c.reportedTrapCount && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Trap / Field Observation:</span>
                            <span className="font-mono text-slate-700">{c.reportedTrapCount}</span>
                          </div>
                        )}
                        {c.recommendedNextAction && (
                          <div className="pt-1.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-700">
                            <strong className="text-slate-900 shrink-0">Next Move:</strong>
                            <span>{c.recommendedNextAction}</span>
                          </div>
                        )}
                      </div>

                      {/* "Why Prioritized" drawer */}
                      {c.priorityReasons && c.priorityReasons.length > 0 && (
                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 text-xs">
                          <button
                            type="button"
                            onClick={() => setExpandedReasonsId(isExpanded ? null : c.id)}
                            className="w-full flex items-center justify-between text-left font-bold text-slate-700 hover:text-slate-900 transition cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>Why Prioritized ({c.priorityReasons.length} evidence factors)</span>
                            </span>
                            <span className="text-xs text-slate-400">{isExpanded ? '▲' : '▼'}</span>
                          </button>

                          {isExpanded && (
                            <ul className="mt-2 space-y-1 text-slate-600 text-[11px] pl-2 border-t border-slate-200/50 pt-2">
                              {c.priorityReasons.map((r, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {!c.verified ? (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() => handleVerifyCase(c.id, true)}
                            className="px-3.5 py-1.5 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Confirm Ground-Truth</span>
                          </button>

                          <button
                            onClick={() => handleVerifyCase(c.id, false)}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>False Positive</span>
                          </button>

                          <button
                            onClick={() => alert(`Lab sample requisition dispatch created for ${c.farmer}. Barcode: MH-LAB-${Date.now().toString().slice(-6)}`)}
                            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>Lab Dispatch</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 font-medium flex items-center space-x-1.5 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Status: <strong>{c.status}</strong> · Logged to Active Learning Queue.</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredCases.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No cases match the selected tab filter.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Field Route & Audio Broadcast Tool */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">

            {/* Field Visit Route Planner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Today&apos;s Field Inspection Route</h3>
                </div>
                <span className="text-xs text-blue-700 font-mono font-bold">4 Farms · 18 km</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Prakash Gaikwad (Niphad Shivar)</span>
                    <span className="text-slate-500">Cotton trap threshold check · 09:30 AM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Sunita More (Dindori Khurd)</span>
                    <span className="text-slate-500">Late blight foliar inspection · 11:15 AM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Ramesh Patil (North Field)</span>
                    <span className="text-slate-500">Tomato diagnostic follow-up · 02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mass Audio Broadcast Tool */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Cluster Voice Broadcast SMS</h3>
                </div>
                <span className="text-xs text-purple-700 font-mono font-bold">Marathi TTS Engine</span>
              </div>

              <div className="space-y-3">
                <textarea
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleSendVoiceBroadcast}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{sentAudio ? 'Broadcast Sent to 420 Farmers ✓' : 'Dispatch Voice Broadcast (IVR + SMS)'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
