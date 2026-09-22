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
  ArrowRight,
  Star,
  TrendingUp,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDiagnosis } from '../context/DiagnosisContext';
import { getPriorityStyles, computeVisitPriorityScore } from '../services/priorityEngine';
import { useCountUp } from '../hooks/useCountUp';
import { getUiTranslation } from '../data/uiTranslations';

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, WATCH: 3 };

/** Computes how many integer days ago a timestamp string / ISO string was */
function daysSince(timestamp) {
  if (!timestamp) return 0;
  // Try ISO parse first
  const d = new Date(timestamp);
  if (!isNaN(d.getTime())) {
    return Math.max(0, Math.round((Date.now() - d.getTime()) / 86400000));
  }
  // Heuristic: "Yesterday" = 1 day, "Today" = 0
  if (typeof timestamp === 'string') {
    if (timestamp.toLowerCase().includes('yesterday')) return 1;
    if (timestamp.toLowerCase().includes('today')) return 0;
    const match = timestamp.match(/(\d+)\s*day/i);
    if (match) return parseInt(match[1], 10);
    // demo BASELINE timestamps: use seeded values below
  }
  return 0;
}

/** Derive nearbyCasesCount for a case from officerCases list (same village proxy) */
function getNearbyCount(c, allCases) {
  const village = (c.village || '').split(',')[0].trim().toLowerCase();
  if (!village) return c.nearbyCasesCount || 2;
  return allCases.filter(
    other => other.id !== c.id && (other.village || '').toLowerCase().includes(village)
  ).length || c.nearbyCasesCount || 1;
}

/** Trust score → label + color */
function trustLabel(score, farmerT = {}) {
  if (score >= 75) return { label: farmerT.statusGood || 'Good', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score >= 55) return { label: farmerT.statusFair || 'Fair', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: farmerT.statusNeedsVerification || 'Needs Verification', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export const ExtensionOfficerDashboard = ({ currentLang, onNavigate, onRoleChange }) => {
  const t = getUiTranslation(currentLang).officer || {};
  const tFarmer = getUiTranslation(currentLang).farmer || {};
  const { officerCases, updateOfficerCaseStatus, farmerTrustScore, weatherSnapshot } = useDiagnosis();

  const [activeTab, setActiveTab] = useState('all');
  const [broadcastText, setBroadcastText] = useState('शेतकरी बांधवांनो, निफाड परिसरात करपा रोगाचा प्रादुर्भाव आढळला आहे. तात्काळ कॉपर ऑक्सीक्लोराईड २५ ग्रॅम प्रति पंप फवारणी करा.');
  const [sentAudio, setSentAudio] = useState(false);
  const [expandedReasonsId, setExpandedReasonsId] = useState(null);

  const humidity = weatherSnapshot?.humidity ?? 60;
  const rainForecast = weatherSnapshot?.rainForecast ?? false;
  const lowTrust = farmerTrustScore < 60;

  // Enrich cases with visit priority score
  const enrichedCases = useMemo(() => {
    return officerCases.map(c => {
      // days_pending: demo baseline cases get seeded values
      const demoSeedDays = { 'DEMO-MH-NSK-201': 3, 'DEMO-MH-NSK-202': 1, 'DEMO-MH-NSK-198': 5 };
      const daysPending = demoSeedDays[c.id] ?? daysSince(c.timestamp);
      // nearby cases: demo seeds
      const demoSeedNearby = { 'DEMO-MH-NSK-201': 4, 'DEMO-MH-NSK-202': 5, 'DEMO-MH-NSK-198': 2 };
      const nearbyCases2km = demoSeedNearby[c.id] ?? getNearbyCount(c, officerCases);

      const visitResult = computeVisitPriorityScore({
        confidence: c.confidence || 0,
        daysPending,
        nearbyCases2km,
        humidity,
        rainForecast,
        lowTrustFarmer: lowTrust
      });

      return {
        ...c,
        daysPending,
        nearbyCases2km,
        visitScore: visitResult.visitScore,
        visitFactors: visitResult.factors,
        weatherRiskMultiplier: visitResult.weatherRiskMultiplier
      };
    });
  }, [officerCases, humidity, rainForecast, lowTrust]);

  // Sort by PRIORITY_ORDER then visitScore descending
  const sortedCases = useMemo(() => {
    return [...enrichedCases].sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority] ?? 4;
      const pB = PRIORITY_ORDER[b.priority] ?? 4;
      if (pA !== pB) return pA - pB;
      return (b.visitScore || 0) - (a.visitScore || 0);
    });
  }, [enrichedCases]);

  const criticalCount = sortedCases.filter(c => c.priority === 'CRITICAL').length;
  const highCount = sortedCases.filter(c => c.priority === 'HIGH').length;
  const pendingCount = sortedCases.filter(c => !c.verified).length;
  const liveCount = sortedCases.filter(c => c.source === 'live_backend').length;

  // Animated counters for right panel
  const animatedCriticalHigh = useCountUp(criticalCount + highCount);
  const animatedPendingCount = useCountUp(pendingCount);
  const animatedLiveCount = useCountUp(liveCount);

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
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleSendVoiceBroadcast = () => {
    setSentAudio(true);
    setTimeout(() => setSentAudio(false), 4000);
  };

  const tBadge = trustLabel(farmerTrustScore, tFarmer);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Welcome Header ── */}
        <div className="bg-[#0F382A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-emerald-950">
                {t.workspaceTag || 'Extension Officer Field Workspace (कृषी सहाय्यक)'}
              </span>
              <span className="text-xs text-emerald-300 font-mono">Nashik Division · Sub-District Niphad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.officerName || 'Extension Officer: Aryan Nakte Gupta'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.subTitle || 'Supervising 28 Village Clusters · 420 Active Farmers'} · {pendingCount} {t.pendingVerification || 'Pending Ground-Truth Validations'}
            </p>
            {/* Weather risk pill */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              weatherSnapshot?.rainForecast ? 'bg-amber-900/40 border-amber-600 text-amber-300' : 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${weatherSnapshot?.rainForecast ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              {weatherSnapshot?.description || 'Weather: Normal'} · Humidity: {humidity}%
              {weatherSnapshot?.rainForecast && ' · Rain risk: 1.5× weather multiplier active'}
            </div>
          </div>

          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 text-xs space-y-2 min-w-[220px]">
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">{t.liveDiagnoses || 'Live AI Diagnoses:'}</span>
              <span className="font-bold text-emerald-400 font-mono">{animatedLiveCount} Ingested</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">{t.criticalHigh || 'Critical / High:'}</span>
              <span className="font-bold text-rose-400 font-mono">{animatedCriticalHigh} Plots</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-emerald-300">{t.pendingVerification || 'Pending Verification:'}</span>
              <span className="font-bold text-amber-400 font-mono">{animatedPendingCount} Cases</span>
            </div>
            <div className="border-t border-emerald-800 pt-2 flex justify-between space-x-4">
              <span className="text-emerald-300">{t.credibility || 'Farmer Credibility:'}</span>
              <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10px] border ${tBadge.color}`}>
                {farmerTrustScore}/100 · {tBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── 60/40 Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ═══════════════════════════════════════════════════ */}
          {/* LEFT (60%): Prioritized Visit Queue                 */}
          {/* ═══════════════════════════════════════════════════ */}
          <div id="officer-queue" className="lg:col-span-7 space-y-6 scroll-mt-24">

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 hover:shadow-md transition-shadow">

              {/* Header & Tabs */}
              <div className="pb-3 border-b border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-emerald-700" />
                    <h2 className="text-base font-bold text-slate-900">
                      {t.queueTitle || 'Urgent Visit Priority Queue'}
                    </h2>
                  </div>
                  <span className="text-xs text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded self-start sm:self-auto">
                    Human-in-the-Loop · visit_priority_score
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: `${t.filterAll || 'All'} (${sortedCases.length})`, cls: 'bg-[#0F382A] text-white', inactiveCls: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
                    { id: 'critical', label: `${t.filterCritical || 'Critical'} (${criticalCount})`, cls: 'bg-rose-600 text-white', inactiveCls: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' },
                    { id: 'high', label: `${t.filterHigh || 'High'} (${highCount})`, cls: 'bg-orange-500 text-white', inactiveCls: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' },
                    { id: 'pending', label: `${t.filterPending || 'Pending'} (${pendingCount})`, cls: 'bg-amber-600 text-white', inactiveCls: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' },
                    { id: 'live', label: `${t.filterLive || 'Live AI'} (${liveCount})`, cls: 'bg-emerald-700 text-white', inactiveCls: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${activeTab === tab.id ? tab.cls : tab.inactiveCls}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Cards */}
              <div className="space-y-4">
                {filteredCases.map((c) => {
                  const pStyle = getPriorityStyles(c.priority);
                  const isExpanded = expandedReasonsId === c.id;
                  const tInfo = trustLabel(farmerTrustScore);

                  return (
                    <div
                      key={c.id}
                      className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all hover:shadow-md ${
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

                            {/* Numeric Trust badge */}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${tInfo.color}`}>
                              Trust: {farmerTrustScore}/100
                            </span>

                            {c.source === 'live_backend' ? (
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white font-mono uppercase animate-pulse">
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

                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pStyle.badge} ${c.priority === 'CRITICAL' ? 'animate-pulse' : ''}`}>
                            {c.priority || 'WATCH'}
                          </span>
                          {/* Visit Priority Score badge */}
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Visit Score: {c.visitScore}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{c.timestamp}</span>
                        </div>
                      </div>

                      {/* Evidence data */}
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
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Weather Multiplier:</span>
                          <span className={`font-mono font-bold text-xs ${c.weatherRiskMultiplier >= 1.5 ? 'text-amber-700' : 'text-slate-600'}`}>
                            {c.weatherRiskMultiplier}× {c.weatherRiskMultiplier >= 1.5 ? '(Humid + Rain)' : '(Normal)'}
                          </span>
                        </div>
                        {c.reportedTrapCount && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Trap / Field Obs:</span>
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

                      {/* "Why Urgent" — 4-factor breakdown drawer */}
                      {c.visitFactors && c.visitFactors.length > 0 && (
                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 text-xs">
                          <button
                            type="button"
                            onClick={() => setExpandedReasonsId(isExpanded ? null : c.id)}
                            className="w-full flex items-center justify-between text-left font-bold text-slate-700 hover:text-slate-900 transition cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>{t.whyUrgent || 'Why Urgent'} — Visit Priority Score: {c.visitScore} / 100</span>
                            </span>
                            <span className="text-xs text-slate-400">{isExpanded ? '▲' : '▼'}</span>
                          </button>

                          {isExpanded && (
                            <div className="mt-2 border-t border-slate-200/50 pt-2">
                              {/* 4-factor breakdown table */}
                              <table className="w-full text-[10px]">
                                <thead>
                                  <tr className="text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                    <th className="text-left py-1 pr-2 font-bold">Factor</th>
                                    <th className="text-right py-1 px-2 font-bold">Value</th>
                                    <th className="text-right py-1 px-2 font-bold">Weight</th>
                                    <th className="text-right py-1 pl-2 font-bold">Points</th>
                                  </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                  {c.visitFactors.map((f, idx) => (
                                    <tr key={idx} className="border-b border-slate-100/70">
                                      <td className="py-1.5 pr-2">
                                        <span className="font-semibold text-slate-800">{f.name}</span>
                                        <p className="text-[9px] text-slate-400 leading-tight">{f.note}</p>
                                      </td>
                                      <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-800">{f.rawValue}</td>
                                      <td className="py-1.5 px-2 text-right font-mono text-slate-500">{typeof f.weight === 'number' ? `×${f.weight}` : f.weight}</td>
                                      <td className={`py-1.5 pl-2 text-right font-mono font-extrabold ${f.contribution >= 20 ? 'text-rose-600' : f.contribution >= 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                                        {f.contribution}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="border-t-2 border-slate-300 font-extrabold">
                                    <td colSpan={3} className="pt-1.5 text-slate-800">Total Visit Priority Score</td>
                                    <td className={`pt-1.5 text-right font-mono text-base ${c.visitScore >= 70 ? 'text-rose-600' : c.visitScore >= 50 ? 'text-orange-600' : 'text-slate-700'}`}>
                                      {c.visitScore}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="text-[9px] text-slate-400 mt-1.5 italic">
                                Formula: (conf × 0.3) + (days_pending × 0.25) + (nearby_2km × 0.25) + (wx_multiplier × 0.2 × 100) — Deterministic frontend prioritization heuristic
                              </p>
                            </div>
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
                            <span>{t.approveConfirm || 'Confirm Ground-Truth'} (+5 Trust)</span>
                          </button>

                          <button
                            onClick={() => handleVerifyCase(c.id, false)}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t.rejectFalse || 'False Positive'} (−3 Trust)</span>
                          </button>

                          <button
                            onClick={() => alert(`Lab sample requisition created for ${c.farmer}. Barcode: MH-LAB-${Date.now().toString().slice(-6)}`)}
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

          {/* ═══════════════════════════════════════════════════ */}
          {/* RIGHT (40%): Field Route + Audio Broadcast          */}
          {/* ═══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">

            {/* ── Today's Inspection Route ── */}
            <div id="officer-route" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow scroll-mt-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">{t.routeTitle || "Today's Field Inspection Route"}</h3>
                </div>
                <span className="text-xs text-blue-700 font-mono font-bold">4 Farms · 18 km</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { num: 1, farmer: 'Prakash Gaikwad (Niphad Shivar)', task: 'Cotton trap threshold check · 09:30 AM', urgent: false },
                  { num: 2, farmer: 'Sunita More (Dindori Khurd)', task: 'Late blight foliar inspection · 11:15 AM', urgent: true },
                  { num: 3, farmer: 'Ramesh Patil (North Field)', task: 'Tomato diagnostic follow-up · 02:00 PM', urgent: false },
                  { num: 4, farmer: 'Balasaheb Thorat (Satana Road)', task: 'Bacterial blight containment check · 04:30 PM', urgent: false },
                ].map(stop => (
                  <div key={stop.num} className={`flex items-center space-x-3 p-3 rounded-2xl border ${stop.urgent ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center text-[10px] shrink-0 ${stop.urgent ? 'bg-rose-600' : 'bg-emerald-800'}`}>
                      {stop.num}
                    </span>
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 block">{stop.farmer}</span>
                      <span className={`${stop.urgent ? 'text-rose-700 font-semibold' : 'text-slate-500'}`}>{stop.task}</span>
                    </div>
                    {stop.urgent && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-blue-800">Total route: Niphad → Dindori → Nashik → Satana · Optimized for fuel efficiency</span>
              </div>
            </div>

            {/* ── Cluster Voice Broadcast SMS ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">{t.sendAudio || 'Cluster Voice Broadcast SMS'}</h3>
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

                <p className="text-[10px] text-slate-400 text-center">
                  Targets 420 farmers in 28 village clusters · Marathi text-to-speech via IVR gateway
                </p>
              </div>
            </div>

            {/* ── Trust Score Panel ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900">Farmer Credibility Index</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Human-in-Loop Learning Signal</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Current Trust Score</span>
                  <span className={`text-xl font-extrabold font-mono ${farmerTrustScore >= 75 ? 'text-emerald-700' : farmerTrustScore >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {farmerTrustScore} / 100
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${farmerTrustScore >= 75 ? 'bg-emerald-500' : farmerTrustScore >= 55 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${farmerTrustScore}%` }}
                  />
                </div>

                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${tBadge.color}`}>
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Status: {tBadge.label} — {farmerTrustScore < 60 ? '+15 priority boost applied to all verification queue items' : 'Normal queue weighting'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-700">How trust updates:</p>
                  <p>✅ Confirm Ground-Truth → <span className="text-emerald-700 font-bold">+5 points</span></p>
                  <p>❌ Mark False Positive → <span className="text-rose-700 font-bold">−3 points</span></p>
                  <p className="text-slate-400 italic">Score clamped 0–100 · Resets per session</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
