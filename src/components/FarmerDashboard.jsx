import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Plus,
  AlertCircle,
  Cloud,
  Sprout,
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { LabReferralModal } from './LabReferralModal';
import { AddFieldModal } from './AddFieldModal';
import { DeviceFrame } from './DeviceFrame';
import { FloatingViewToggle } from './FloatingViewToggle';
import { FieldHealthPassport } from './FieldHealthPassport';
import { useDiagnosis } from '../context/DiagnosisContext';
import { cropDiseases } from '../data/cropDiseases';
import { useCountUp } from '../hooks/useCountUp';
import { getUiTranslation } from '../data/uiTranslations';
import { KrushiHeroSection } from './KrushiHeroSection';

// Field Health Action Timeline Component
const FieldHealthTimeline = ({ timelineStep = 'Scan Completed', priority = 'WATCH', timestamp = 'Just now', currentLang = 'en' }) => {
  const t = getUiTranslation(currentLang).farmer || {};
  const steps = [
    { key: 'Scan Completed', label: t.timelineScan || 'Scan Completed', desc: 'PyTorch inference pass' },
    { key: 'Disease Identified', label: t.timelineDisease || 'Disease Identified', desc: 'Foliar pathology match' },
    { key: 'Priority Assigned', label: t.timelinePriority || 'Priority Assigned', desc: priority },
    { key: 'Advisory Generated', label: t.timelineAdvisory || 'Advisory Generated', desc: 'CIBRC IPM rules' },
    { key: 'Follow-up Required', label: t.timelineFollowup || 'Follow-up / Monitored', desc: 'Field observation' }
  ];

  const currentIdx = steps.findIndex(s => s.key === timelineStep) !== -1
    ? steps.findIndex(s => s.key === timelineStep)
    : 3;

  return (
    <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <h3 className="font-serif-display font-bold text-stone-900 text-sm sm:text-base">
            {t.timelineTitle || 'Field Health Action Timeline'}
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
          {timestamp}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                  isCurrent
                    ? priority === 'CRITICAL'
                      ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                      : priority === 'HIGH'
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                      : 'bg-[#0F5137] text-white ring-4 ring-emerald-100'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>

              <p className={`mt-2 text-[10px] sm:text-xs font-bold leading-tight ${
                isCompleted ? 'text-stone-900' : 'text-stone-400'
              }`}>
                {step.label}
              </p>

              <p className="mt-0.5 text-[9px] text-stone-500 hidden sm:block">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// "Why This Case Is Prioritized" Explainability Component
const WhyPrioritizedCard = ({ priority = 'WATCH', reasons = [], nextAction = '' }) => {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={`rounded-3xl p-4 sm:p-5 border shadow-sm transition-all ${
      priority === 'CRITICAL'
        ? 'bg-rose-50/80 border-rose-200 text-rose-950'
        : priority === 'HIGH'
        ? 'bg-orange-50/80 border-orange-200 text-orange-950'
        : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-black/5">
        <div className="flex items-center gap-2">
          <span className="text-base">{priority === 'CRITICAL' || priority === 'HIGH' ? '⚠️' : '🌿'}</span>
          <h4 className="font-serif-display font-bold text-xs sm:text-sm uppercase tracking-wider font-mono">
            Why This Case Is Prioritized
          </h4>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
          priority === 'CRITICAL'
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : priority === 'HIGH'
            ? 'bg-orange-100 text-orange-800 border-orange-300'
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {priority} Priority
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs font-medium">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-700 mt-0.5 shrink-0">•</span>
            <span className="leading-relaxed">{reason}</span>
          </li>
        ))}
      </ul>

      {nextAction && (
        <div className="mt-3 pt-2.5 border-t border-black/5 flex items-start gap-2 text-xs font-semibold">
          <span className="text-stone-500 uppercase tracking-wider text-[10px]">Action:</span>
          <span>{nextAction}</span>
        </div>
      )}
    </div>
  );
};

export const FarmerDashboard = ({ currentLang, onNavigate }) => {
  const [viewMode, setViewMode] = useState('website'); // 'website' | 'mobile'
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [farmerAcreage, setFarmerAcreage] = useState(4.5);

  // Single source of truth from DiagnosisContext
  const {
    fields,
    addField,
    selectedField,
    setSelectedField,
    farmerStats,
    mergedRecentScans,
    latestDiagnosis,
    setSelectedDisease,
    farmerTrustScore,
    weatherSnapshot
  } = useDiagnosis();

  const farmer = {
    name: 'Ramesh Patil',
    location: 'Nashik District, Maharashtra · 4.5 acres under cultivation',
    acres: farmerAcreage,
    totalScans: farmerStats.totalScans,
    issuesDetected: farmerStats.issuesDetected,
    resolved: farmerStats.resolved,
    lossPrevented: farmerStats.lossPrevented
  };

  const recentScans = mergedRecentScans;

  const hotspots = [
    { id: 'hs-1', district: 'Nashik', disease: 'Downy Mildew', cases: 34, isCritical: true },
    { id: 'hs-2', district: 'Pune', disease: 'Rust', cases: 21, isCritical: false },
    { id: 'hs-3', district: 'Aurangabad', disease: 'Pink Bollworm', cases: 18, isCritical: false },
    { id: 'hs-4', district: 'Nagpur', disease: 'Citrus Canker', cases: 9, isCritical: false },
  ];

  const handleAddField = (newField) => {
    addField(newField);
    setFarmerAcreage((prev) => parseFloat((prev + newField.acres).toFixed(1)));
  };

  // Animated counters for Farmer stats
  const animatedTotalScans = useCountUp(farmerStats.totalScans);
  const animatedIssuesDetected = useCountUp(farmerStats.issuesDetected);
  const animatedLossPrevented = useCountUp(farmerStats.lossPrevented);
  const t = getUiTranslation(currentLang).farmer || {};

  // 1. Field Credibility Card
  const CredibilityCard = (() => {
    const score = farmerTrustScore || 72;
    const credLabel = score >= 75 ? (t.statusGood || 'Good') : score >= 55 ? (t.statusFair || 'Fair') : (t.statusNeedsVerification || 'Needs Verification');
    const credColor = score >= 75
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : score >= 55
      ? 'bg-amber-50 border-amber-300 text-amber-800'
      : 'bg-rose-50 border-rose-300 text-rose-800';
    const barColor = score >= 75 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-400' : 'bg-rose-500';
    return (
      <div id="farmer-credibility" className={`rounded-3xl p-4 sm:p-5 border shadow-sm space-y-3 scroll-mt-24 hover:shadow-md transition-shadow ${credColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏅</span>
            <h3 className="font-bold text-sm">{t.credibilityTitle || 'Field Credibility & Trust Rating'}</h3>
          </div>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border font-mono ${credColor}`}>
            {credLabel}
          </span>
        </div>
        <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs leading-relaxed opacity-80">
          {t.verifiedByOfficers || 'Verified by Agricultural Extension Officers. Accurate reports help prioritize your plots for faster field visits.'}
        </p>
      </div>
    );
  })();

  // 2. Field Health Trend (30-day SVG sparkline)
  const HealthTrendCard = (() => {
    const activeField = fields[0];
    const trend = activeField?.healthTrend || [];
    if (trend.length === 0) return null;

    const W = 300, H = 72, PAD = 8;
    const scores = trend.map(item => item.score);
    const minS = Math.min(...scores), maxS = Math.max(...scores);
    const range = maxS - minS || 1;

    const pts = trend.map((item, i) => {
      const x = PAD + ((i / (trend.length - 1)) * (W - 2 * PAD));
      const y = H - PAD - ((item.score - minS) / range) * (H - 2 * PAD);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const latestScore = scores[scores.length - 1];
    const trendColor = latestScore >= 80 ? '#10b981' : latestScore >= 65 ? '#f59e0b' : '#ef4444';

    return (
      <div id="farmer-fields" className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 scroll-mt-24 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-base">📈</span>
            <h3 className="font-bold text-sm text-slate-900">{t.healthTrendTitle || 'Field Health Trend — 30 Days'}</h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {activeField?.name?.replace('[DEMO / BASELINE] ', '')}
          </span>
        </div>
        <div className="mt-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20 rounded-xl">
            {[25, 50, 75].map(pct => {
              const y = H - PAD - ((pct - minS) / range) * (H - 2 * PAD);
              if (y < PAD || y > H - PAD) return null;
              return <line key={pct} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />;
            })}
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={trendColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              points={`${PAD},${H - PAD} ${pts.join(' ')} ${W - PAD},${H - PAD}`}
              fill="url(#sparkFill)"
            />
            <polyline points={pts.join(' ')} fill="none" stroke={trendColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={trendColor} />
          </svg>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 px-1">
            <span>30d ago</span>
            <span className="font-bold text-slate-600">{t.currentScore || 'Current Health Score'}: <span style={{ color: trendColor }}>{latestScore}%</span></span>
            <span>Today</span>
          </div>
        </div>
      </div>
    );
  })();

  // 3. PHI Compliance Tracker
  const PhiTrackerCard = (() => {
    const activeField = fields[0];
    if (!activeField?.lastSprayDate || !activeField?.phiDays) return null;

    const lastSpray = new Date(activeField.lastSprayDate);
    const daysSinceSpray = Math.round((Date.now() - lastSpray.getTime()) / 86400000);
    const daysUntilSafe = Math.max(0, activeField.phiDays - daysSinceSpray);
    const isHarvestSafe = daysUntilSafe === 0;
    const isNearPHI = daysUntilSafe <= 5 && daysUntilSafe > 0;

    const sprayLabel = lastSpray.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const phiColor = isHarvestSafe
      ? 'border-emerald-200 bg-emerald-50'
      : isNearPHI
      ? 'border-amber-300 bg-amber-50'
      : 'border-rose-200 bg-rose-50';
    const phiStatusColor = isHarvestSafe ? 'text-emerald-700' : isNearPHI ? 'text-amber-700' : 'text-rose-700';
    const phiBarColor = isHarvestSafe ? 'bg-emerald-500' : isNearPHI ? 'bg-amber-400' : 'bg-rose-500';
    const phiPct = Math.round((daysSinceSpray / activeField.phiDays) * 100);

    return (
      <div id="farmer-phi" className={`rounded-3xl p-4 sm:p-5 border shadow-sm scroll-mt-24 space-y-3 hover:shadow-md transition-shadow ${phiColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <h3 className="font-bold text-sm text-slate-900">{t.phiTitle || 'PHI Compliance Tracker'}</h3>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border font-mono ${
            isHarvestSafe ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
            isNearPHI ? 'bg-amber-100 border-amber-300 text-amber-800' :
            'bg-rose-100 border-rose-300 text-rose-800'
          }`}>
            {isHarvestSafe ? (t.safeToHarvest || 'SAFE TO HARVEST') : isNearPHI ? 'CAUTION (PHI)' : (t.sprayResidue || 'SPRAY RESIDUE ACTIVE')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/70 rounded-2xl p-3 border border-black/5">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">{t.lastSprayed || 'Last Chemical Applied'}</span>
            <span className="font-bold text-slate-800 block mt-0.5 leading-tight text-[11px]">{activeField.lastSprayChemical}</span>
            <span className="text-slate-500 text-[10px]">{daysSinceSpray} days ago</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-3 border border-black/5">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">PHI Window</span>
            <span className="font-mono font-bold text-slate-900 block mt-0.5">{activeField.phiDays} days</span>
            <span className="text-slate-500 text-[10px]">CIBRC Official</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Spray</span>
            <span className={`font-bold ${phiStatusColor}`}>{isHarvestSafe ? 'Safe' : `${daysUntilSafe}d left`}</span>
            <span>Harvest</span>
          </div>
          <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${phiBarColor}`}
              style={{ width: `${Math.min(100, phiPct)}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-500 italic">
          {t.phiSubtitle || 'CIBRC Safe Harvest Interval Monitoring. Do not harvest produce before PHI expires.'}
        </p>
      </div>
    );
  })();

  // 4. Nearest Agri-Input Store Stock
  const NearestStoreCard = (() => {
    const activeField = fields[0];
    const latestDisease = (activeField?.diseaseHistory?.[0] || '').toLowerCase();

    const govtStocks = [
      { molecule: 'Copper Oxychloride 50 WP', stockPct: 84, relevance: ['blight', 'downy', 'bacterial', 'canker', 'spot'] },
      { molecule: 'Trichoderma viride 2% WP', stockPct: 72, relevance: ['soil', 'rot', 'wilt', 'fusarium'] },
      { molecule: 'Chlorantraniliprole 18.5 SC', stockPct: 28, relevance: ['bollworm', 'moth', 'larva', 'borer'] },
      { molecule: 'Beauveria bassiana 1.15% WP', stockPct: 65, relevance: ['whitefly', 'thrips', 'aphid', 'mite'] },
    ];

    const relevant = govtStocks.filter(s =>
      s.relevance.some(kw => latestDisease.includes(kw))
    );
    const display = relevant.length >= 2 ? relevant.slice(0, 3) : govtStocks.slice(0, 3);

    return (
      <div id="farmer-store" className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm scroll-mt-24 space-y-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-base">🏪</span>
            <h3 className="font-bold text-sm text-slate-900">{t.nearestStoreTitle || 'Nearest Certified Agri-Input Retailer'}</h3>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
            {t.nearestStoreSubtitle || 'Govt Buffer Stock'}
          </span>
        </div>

        <div className="space-y-2">
          {display.map((item, idx) => {
            const isLow = item.stockPct <= 28;
            return (
              <div key={idx} className={`flex items-center justify-between p-2.5 rounded-2xl text-xs border ${
                isLow ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="font-bold text-slate-900 block">{item.molecule}</span>
                  {isLow && <span className="text-[10px] text-rose-700 font-bold">🚨 {t.lowStock || 'Low stock'} — check supplier</span>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.stockPct}%
                  </span>
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${item.stockPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  })();

  // Farmer Dashboard Layout Content
  const DashboardCore = (
    <div className="space-y-5">

      {/* Photo 2: Farmer Hero Profile Card (Forest Green) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E5137] to-[#164E35] p-5 sm:p-6 text-white shadow-lg border border-emerald-900/40">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <p className="text-emerald-200/90 text-sm font-medium tracking-wide">
            {t.greeting || 'Good morning,'}
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-0.5 mb-1.5 drop-shadow-xs">
            {farmer.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-100/85">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-xs shadow-rose-400/50" />
            <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span>{farmer.location}</span>
          </div>
        </div>

        {/* 4 Stats Grid (2x2) */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3.5 relative z-10">
          <div
            onClick={() => onNavigate('diagnosis')}
            className="rounded-2xl bg-[#245E41]/80 hover:bg-[#245E41] backdrop-blur-xs border border-white/10 p-3.5 transition cursor-pointer group shadow-xs"
          >
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {animatedTotalScans}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-100/80 font-medium">
              <span className="text-xs group-hover:scale-110 transition-transform">📷</span>
              <span>{t.totalScans || 'Total Scans'}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-between">
              <span>{animatedIssuesDetected}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200/90 font-medium">
              <span className="text-xs">⚠️</span>
              <span>{t.issuesDetected || 'Issues Detected'}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {farmer.resolved}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-200 font-medium">
              <span className="text-xs">✅</span>
              <span>{t.resolved || 'Resolved'}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ₹{animatedLossPrevented.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200 font-medium">
              <span className="text-xs">💰</span>
              <span>{t.lossPrevented || 'Loss Prevented'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo 2: Weather Risk Card (Terracotta / Amber) */}
      <div
        onClick={() => onNavigate('weather')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D4681E] via-[#C8621A] to-[#B25313] p-5 sm:p-6 text-white shadow-lg border border-amber-800/30 cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-amber-100/90 font-mono">
            {t.weatherRiskTitle || 'WEATHER RISK'}
          </span>
          <span className="bg-white/25 backdrop-blur-xs border border-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
            HIGH
          </span>
        </div>

        <div className="mt-3 relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner border border-white/30 text-white">
            <Cloud className="w-7 h-7 text-white fill-white/80 filter drop-shadow-sm" />
          </div>
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Partly Cloudy
            </h2>
            <p className="text-xs text-amber-100/90 font-medium">
              Nashik, Aug 22
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
          <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
            <div className="text-sm mb-0.5">🌡️</div>
            <div className="text-base sm:text-lg font-bold text-white leading-tight">32°C</div>
            <div className="text-[10px] text-amber-100/80 font-medium">Temp</div>
          </div>

          <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
            <div className="text-sm mb-0.5">💧</div>
            <div className="text-base sm:text-lg font-bold text-white leading-tight">78%</div>
            <div className="text-[10px] text-amber-100/80 font-medium">{t.relHumidity || 'Humidity'}</div>
          </div>

          <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
            <div className="text-sm mb-0.5">💨</div>
            <div className="text-base sm:text-lg font-bold text-white leading-tight">12 km/h</div>
            <div className="text-[10px] text-amber-100/80 font-medium">{t.windSpeed || 'Wind'}</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-start gap-2 relative z-10">
          <AlertCircle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-50 leading-relaxed font-medium">
            {t.optimalSpraying || 'High humidity favors fungal spread. Inspect crops early morning.'}
          </p>
        </div>
      </div>

      {/* ── Field Credibility Badge (Farmer-Exclusive) ── */}
      {CredibilityCard}

      {/* ── Field Health Trend — 30-Day SVG Sparkline (Farmer-Exclusive) ── */}
      {HealthTrendCard}

      {/* ── PHI Compliance Tracker (Farmer-Exclusive) ── */}
      {PhiTrackerCard}

      {/* ── Nearest Agri-Input Store Stock (Farmer-Exclusive) ── */}
      {NearestStoreCard}

      {/* Photo 3: 4 Quick Actions (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
        <button
          onClick={() => onNavigate('diagnosis')}
          className="group relative overflow-hidden rounded-3xl bg-[#1E5137] hover:bg-[#164E35] p-4 sm:p-5 text-left text-white shadow-md border border-emerald-800/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-white leading-tight">
            {t.quickScan || 'Scan Crop'}
          </h3>
          <p className="mt-1 text-xs text-emerald-100/80 line-clamp-1">
            {t.quickScanDesc || 'Instant PyTorch diagnostic'}
          </p>
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        <button
          onClick={() => onNavigate('hotspots')}
          className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
            🗺️
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
            {t.quickHotspots || 'Hotspot Map'}
          </h3>
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {t.quickHotspotsDesc || '3 active alerts nearby'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('ipm')}
          className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
            📋
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
            {t.quickAdvisories || 'Advisories'}
          </h3>
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {t.quickAdvisoriesDesc || '2 new expert guides'}
          </p>
        </button>

        <button
          onClick={() => setIsLabOpen(true)}
          className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
            🔬
          </div>
          <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
            {t.quickLab || 'Lab Referral'}
          </h3>
          <p className="mt-1 text-xs text-stone-500 line-clamp-1">
            {t.quickLabDesc || 'KVK PCR sample test'}
          </p>
        </button>
      </div>

      {/* Dynamic Field Health Action Timeline */}
      <FieldHealthTimeline
        currentLang={currentLang}
        timelineStep={latestDiagnosis?.timelineStep || (recentScans[0]?.timelineStep || 'Scan Completed')}
        priority={latestDiagnosis?.priority || (recentScans[0]?.priority || 'WATCH')}
        timestamp={latestDiagnosis?.timestamp || 'Latest Evidence'}
      />

      {/* Dynamic "Why This Case Is Prioritized" Explainability */}
      <WhyPrioritizedCard
        priority={latestDiagnosis?.priority || (recentScans[0]?.priority || 'WATCH')}
        reasons={latestDiagnosis?.priorityReasons || (recentScans[0]?.priorityReasons || [])}
        nextAction={latestDiagnosis?.recommendedNextAction || (recentScans[0]?.recommendedNextAction || '')}
      />

      {/* Dynamic Recent Scans */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-display text-lg font-bold text-stone-900">
              Recent Scans
            </h2>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              {recentScans.filter(s => s.isLive).length} Live
            </span>
          </div>
          <button
            onClick={() => onNavigate('diagnosis')}
            className="text-amber-800 hover:text-amber-900 text-xs sm:text-sm font-semibold transition hover:underline cursor-pointer"
          >
            See all →
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {recentScans.map((scan) => (
            <div
              key={scan.id}
              className="py-3.5 flex items-center justify-between gap-3 group hover:bg-stone-50/50 -mx-2 px-2 rounded-2xl transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-stone-100 shadow-2xs">
                  <img
                    src={scan.image}
                    alt={scan.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-serif-display font-bold text-stone-900 text-sm sm:text-base truncate">
                      {scan.disease}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scan.severity === 'High' || scan.priority === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                        : scan.severity === 'Medium' || scan.priority === 'HIGH'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200/80'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    }`}>
                      {scan.severity || scan.priority}
                    </span>
                    {scan.isLive ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono">
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-mono">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 truncate mt-0.5">
                    {scan.crop} · {scan.confidence}% confidence · {scan.time}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const matched = cropDiseases.find(d =>
                    d.name.toLowerCase().includes(scan.disease.toLowerCase()) ||
                    scan.disease.toLowerCase().includes(d.name.toLowerCase()) ||
                    d.crop.toLowerCase().includes(scan.crop.toLowerCase())
                  );
                  if (matched) {
                    setSelectedDisease(matched);
                  }
                  onNavigate('ipm');
                }}
                className="shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition shadow-2xs cursor-pointer"
              >
                Advisory
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Photos 3 & 4: Nearby Hotspots */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">
            Nearby Hotspots
          </h2>
          <button
            onClick={() => onNavigate('hotspots')}
            className="rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-[#1E5137] border border-emerald-200/70 text-xs font-semibold px-3 py-1 transition flex items-center gap-1 cursor-pointer"
          >
            View Map →
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {hotspots.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('hotspots')}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-stone-50/70 -mx-2 px-2 rounded-2xl transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.isCritical
                      ? 'bg-rose-500 shadow-xs shadow-rose-500/50'
                      : 'bg-amber-500 shadow-xs shadow-amber-500/50'
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm sm:text-base leading-tight group-hover:text-[#1E5137] transition">
                    {item.district}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {item.disease}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-bold text-sm sm:text-base ${
                    item.isCritical ? 'text-rose-600' : 'text-amber-600'
                  }`}
                >
                  {item.cases}
                </span>
                <span className="text-[11px] text-stone-400 block -mt-0.5">
                  cases
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photos 4 & 5: My Fields */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="font-serif-display text-lg font-bold text-stone-900">
            My Fields
          </h2>
          <button
            onClick={() => setIsAddFieldOpen(true)}
            className="rounded-full bg-[#1E5137] hover:bg-[#164E35] text-white text-xs font-semibold px-3 py-1.5 transition flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Field</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {fields.map((field) => (
            <div
              key={field.id}
              className="py-4 first:pt-4 last:pb-1 cursor-pointer group"
              onClick={() => setSelectedField(field)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedField(field);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open health passport for ${field.name}`}
            >
              <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                <img
                  src={field.imageUrl}
                  alt={field.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                {field.healthScore && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                    Health: {field.healthScore}%
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif-display font-bold text-stone-900 text-base leading-tight">
                    {field.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {field.acres} acres · Last check: {field.lastScanned}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  field.status === 'At Risk'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                    : field.status === 'Healthy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : 'bg-orange-50 text-orange-700 border border-orange-200/80'
                }`}>
                  {field.status}
                </span>
              </div>

              <div className="mt-3">
                <button
                  onClick={() => onNavigate('diagnosis')}
                  className="w-full rounded-full py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-emerald-600 hover:text-[#1E5137] hover:bg-emerald-50/50 transition duration-150 shadow-2xs cursor-pointer text-center"
                >
                  Scan This Field
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo 5: Official SIH 2026 & Government of Maharashtra Footer */}
      <footer className="mt-8 rounded-3xl bg-[#164E35] text-white p-6 sm:p-8 border-t border-emerald-900/50 shadow-inner space-y-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-700/60 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold tracking-tight text-white">
              KrishiRakshak
            </h3>
          </div>
          <p className="mt-2.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
            AI-powered crop health intelligence for Indian farmers. Smart India Hackathon 2026 — Problem #26131.
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-800/60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government of Maharashtra</span>
          </div>
          <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">
            Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-800/60">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Farmer Support
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-sm font-semibold text-emerald-100">Kisan Call Centre</span>
            <span className="text-emerald-700">|</span>
            <a
              href="tel:18001801551"
              className="font-mono text-sm sm:text-base font-bold text-white hover:text-amber-300 transition tracking-wide"
            >
              1800-180-1551
            </a>
          </div>
          <p className="mt-1 text-xs text-emerald-200/70">
            Official toll-free agricultural support • 6:00 AM–10:00 PM
          </p>
        </div>

        <div className="pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <p>© 2026 KrishiRakshak · Smart India Hackathon</p>
          <p className="text-emerald-300/80 font-medium">Agriculture, FoodTech & Rural Development</p>
        </div>
      </footer>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F1EA]">
      {selectedField && (
        <FieldHealthPassport
          field={selectedField}
          recentScans={recentScans}
          onClose={() => setSelectedField(null)}
          onNavigate={(destination) => {
            setSelectedField(null);
            onNavigate?.(destination);
          }}
        />
      )}

      {/* Signature KrushiRaksha Hero Experience */}
      {viewMode !== 'mobile' && (
        <KrushiHeroSection
          currentLang={currentLang}
          onNavigate={onNavigate}
          isFarmerDashboard={true}
        />
      )}

      {/* Mobile Device Frame View vs Full Desktop View */}
      {viewMode === 'mobile' ? (
        <div className="py-6 sm:py-10">
          <DeviceFrame>
            <div className="p-4 bg-[#FAF6F0] min-h-full">
              {DashboardCore}
            </div>
          </DeviceFrame>
        </div>
      ) : (
        <div id="farmer-workspace-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Farmer Profile Hero */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E5137] to-[#164E35] p-5 sm:p-6 text-white shadow-lg border border-emerald-900/40">
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-emerald-200/90 text-sm font-medium tracking-wide">
                    {t.greeting || 'Good morning,'}
                  </p>
                  <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-0.5 mb-1.5 drop-shadow-xs">
                    {farmer.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-100/85">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-xs shadow-rose-400/50" />
                    <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span>{farmer.location}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3.5 relative z-10">
                  <div
                    onClick={() => onNavigate('diagnosis')}
                    className="rounded-2xl bg-[#245E41]/80 hover:bg-[#245E41] backdrop-blur-xs border border-white/10 p-3.5 transition cursor-pointer group shadow-xs"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {animatedTotalScans}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-100/80 font-medium">
                      <span className="text-xs group-hover:scale-110 transition-transform">📷</span>
                      <span>{t.totalScans || 'Total Scans'}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
                    <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-between">
                      <span>{animatedIssuesDetected}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200/90 font-medium">
                      <span className="text-xs">⚠️</span>
                      <span>{t.issuesDetected || 'Issues Detected'}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
                    <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {farmer.resolved}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-200 font-medium">
                      <span className="text-xs">✅</span>
                      <span>{t.resolved || 'Resolved'}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#245E41]/80 backdrop-blur-xs border border-white/10 p-3.5 transition shadow-xs">
                    <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      ₹{animatedLossPrevented.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200 font-medium">
                      <span className="text-xs">💰</span>
                      <span>{t.lossPrevented || 'Loss Prevented'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Quick Action Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                <button
                  onClick={() => onNavigate('diagnosis')}
                  className="group relative overflow-hidden rounded-3xl bg-[#1E5137] hover:bg-[#164E35] p-4 sm:p-5 text-left text-white shadow-md border border-emerald-800/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-white leading-tight">
                    {t.quickScan || 'Scan Crop'}
                  </h3>
                  <p className="mt-1 text-xs text-emerald-100/80 line-clamp-1">
                    {t.quickScanDesc || 'Instant PyTorch diagnostic'}
                  </p>
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </button>

                <button
                  onClick={() => onNavigate('hotspots')}
                  className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
                    🗺️
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
                    {t.quickHotspots || 'Hotspot Map'}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                    {t.quickHotspotsDesc || '3 active alerts nearby'}
                  </p>
                </button>

                <button
                  onClick={() => onNavigate('ipm')}
                  className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
                    📋
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
                    {t.quickAdvisories || 'Advisories'}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                    {t.quickAdvisoriesDesc || '2 new expert guides'}
                  </p>
                </button>

                <button
                  onClick={() => setIsLabOpen(true)}
                  className="group relative overflow-hidden rounded-3xl bg-white hover:bg-stone-50/80 p-4 sm:p-5 text-left shadow-sm border border-stone-200/80 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
                    🔬
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-stone-900 leading-tight">
                    {t.quickLab || 'Lab Referral'}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-1">
                    {t.quickLabDesc || 'KVK PCR sample test'}
                  </p>
                </button>
              </div>

              {/* My Fields Section */}
              <div id="farmer-fields" className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80 scroll-mt-24">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="font-serif-display text-lg font-bold text-stone-900">
                    {t.registeredFields || 'My Fields'}
                  </h2>
                  <button
                    onClick={() => setIsAddFieldOpen(true)}
                    className="rounded-full bg-[#1E5137] hover:bg-[#164E35] text-white text-xs font-semibold px-3 py-1.5 transition flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addField || '+ Add Field'}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {fields.map((field) => (
                    <div
              key={field.id}
              className="py-4 first:pt-4 last:pb-1 cursor-pointer group"
              onClick={() => setSelectedField(field)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedField(field);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open health passport for ${field.name}`}
            >
                      <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={field.imageUrl}
                          alt={field.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        {field.healthScore && (
                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                            Health: {field.healthScore}%
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-serif-display font-bold text-stone-900 text-base leading-tight">
                            {field.name}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {field.acres} acres · Last check: {field.lastScanned}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          field.status === 'At Risk'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                            : field.status === 'Healthy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-orange-50 text-orange-700 border border-orange-200/80'
                        }`}>
                          {field.status}
                        </span>
                      </div>

                      <div className="mt-3">
                        <button
                          onClick={() => onNavigate('diagnosis')}
                          className="w-full rounded-full py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-emerald-600 hover:text-[#1E5137] hover:bg-emerald-50/50 transition duration-150 shadow-2xs cursor-pointer text-center"
                        >
                          Scan This Field
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Weather Risk Card */}
              <div
                onClick={() => onNavigate('weather')}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D4681E] via-[#C8621A] to-[#B25313] p-5 sm:p-6 text-white shadow-lg border border-amber-800/30 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-amber-100/90 font-mono">
                    {t.weatherRiskTitle || 'WEATHER RISK'}
                  </span>
                  <span className="bg-white/25 backdrop-blur-xs border border-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                    HIGH
                  </span>
                </div>

                <div className="mt-3 relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner border border-white/30 text-white">
                    <Cloud className="w-7 h-7 text-white fill-white/80 filter drop-shadow-sm" />
                  </div>
                  <div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                      Partly Cloudy
                    </h2>
                    <p className="text-xs text-amber-100/90 font-medium">
                      Nashik, Aug 22
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
                  <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
                    <div className="text-sm mb-0.5">🌡️</div>
                    <div className="text-base sm:text-lg font-bold text-white leading-tight">32°C</div>
                    <div className="text-[10px] text-amber-100/80 font-medium">Temp</div>
                  </div>

                  <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
                    <div className="text-sm mb-0.5">💧</div>
                    <div className="text-base sm:text-lg font-bold text-white leading-tight">78%</div>
                    <div className="text-[10px] text-amber-100/80 font-medium">{t.relHumidity || 'Humidity'}</div>
                  </div>

                  <div className="rounded-2xl bg-black/15 backdrop-blur-xs border border-white/10 p-2.5 text-center">
                    <div className="text-sm mb-0.5">💨</div>
                    <div className="text-base sm:text-lg font-bold text-white leading-tight">12 km/h</div>
                    <div className="text-[10px] text-amber-100/80 font-medium">{t.windSpeed || 'Wind'}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-start gap-2 relative z-10">
                  <AlertCircle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-50 leading-relaxed font-medium">
                    {t.optimalSpraying || 'High humidity favors fungal spread. Inspect crops early morning.'}
                  </p>
                </div>
              </div>

              {/* ── Field Credibility Badge (Farmer-Exclusive) ── */}
              {CredibilityCard}

              {/* ── Field Health Trend — 30-Day SVG Sparkline (Farmer-Exclusive) ── */}
              {HealthTrendCard}

              {/* ── PHI Compliance Tracker (Farmer-Exclusive) ── */}
              {PhiTrackerCard}

              {/* ── Nearest Agri-Input Store Stock (Farmer-Exclusive) ── */}
              {NearestStoreCard}

              {/* Dynamic Field Health Action Timeline */}
              <FieldHealthTimeline
                currentLang={currentLang}
                timelineStep={latestDiagnosis?.timelineStep || (recentScans[0]?.timelineStep || 'Scan Completed')}
                priority={latestDiagnosis?.priority || (recentScans[0]?.priority || 'WATCH')}
                timestamp={latestDiagnosis?.timestamp || 'Latest Evidence'}
              />

              {/* Dynamic "Why This Case Is Prioritized" Explainability */}
              <WhyPrioritizedCard
                priority={latestDiagnosis?.priority || (recentScans[0]?.priority || 'WATCH')}
                reasons={latestDiagnosis?.priorityReasons || (recentScans[0]?.priorityReasons || [])}
                nextAction={latestDiagnosis?.recommendedNextAction || (recentScans[0]?.recommendedNextAction || '')}
              />

              {/* Recent Scans */}
              <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-display text-lg font-bold text-stone-900">
                      Recent Scans
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                      {recentScans.filter(s => s.isLive).length} Live
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('diagnosis')}
                    className="text-amber-800 hover:text-amber-900 text-xs sm:text-sm font-semibold transition hover:underline cursor-pointer"
                  >
                    See all →
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="py-3.5 flex items-center justify-between gap-3 group hover:bg-stone-50/50 -mx-2 px-2 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-stone-100 shadow-2xs">
                          <img
                            src={scan.image}
                            alt={scan.crop}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif-display font-bold text-stone-900 text-sm sm:text-base truncate">
                              {scan.disease}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              scan.severity === 'High' || scan.priority === 'CRITICAL'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                                : scan.severity === 'Medium' || scan.priority === 'HIGH'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200/80'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            }`}>
                              {scan.severity || scan.priority}
                            </span>
                            {scan.isLive ? (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono">
                                LIVE
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-mono">
                                DEMO
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-stone-500 truncate mt-0.5">
                            {scan.crop} · {scan.confidence}% confidence · {scan.time}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const matched = cropDiseases.find(d =>
                            d.name.toLowerCase().includes(scan.disease.toLowerCase()) ||
                            scan.disease.toLowerCase().includes(d.name.toLowerCase()) ||
                            d.crop.toLowerCase().includes(scan.crop.toLowerCase())
                          );
                          if (matched) {
                            setSelectedDisease(matched);
                          }
                          onNavigate('ipm');
                        }}
                        className="shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/40 transition shadow-2xs cursor-pointer"
                      >
                        Advisory
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Hotspots */}
              <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-stone-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="font-serif-display text-lg font-bold text-stone-900">
                    Nearby Hotspots
                  </h2>
                  <button
                    onClick={() => onNavigate('hotspots')}
                    className="rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-[#1E5137] border border-emerald-200/70 text-xs font-semibold px-3 py-1 transition flex items-center gap-1 cursor-pointer"
                  >
                    View Map →
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {hotspots.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('hotspots')}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-stone-50/70 -mx-2 px-2 rounded-2xl transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            item.isCritical
                              ? 'bg-rose-500 shadow-xs shadow-rose-500/50'
                              : 'bg-amber-500 shadow-xs shadow-amber-500/50'
                          }`}
                        />
                        <div>
                          <h4 className="font-semibold text-stone-900 text-sm sm:text-base leading-tight group-hover:text-[#1E5137] transition">
                            {item.district}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {item.disease}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-bold text-sm sm:text-base ${
                            item.isCritical ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        >
                          {item.cases}
                        </span>
                        <span className="text-[11px] text-stone-400 block -mt-0.5">
                          cases
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Official Footer */}
          <footer className="mt-8 rounded-3xl bg-[#164E35] text-white p-6 sm:p-8 border-t border-emerald-900/50 shadow-inner space-y-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-700/60 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Sprout className="w-5 h-5 text-emerald-300" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold tracking-tight text-white">
                  KrishiRakshak
                </h3>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                AI-powered crop health intelligence for Indian farmers. Smart India Hackathon 2026 — Problem #26131.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-800/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Government of Maharashtra</span>
              </div>
              <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">
                Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-800/60">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Farmer Support
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-sm font-semibold text-emerald-100">Kisan Call Centre</span>
                <span className="text-emerald-700">|</span>
                <a
                  href="tel:18001801551"
                  className="font-mono text-sm sm:text-base font-bold text-white hover:text-amber-300 transition tracking-wide"
                >
                  1800-180-1551
                </a>
              </div>
              <p className="mt-1 text-xs text-emerald-200/70">
                Official toll-free agricultural support • 6:00 AM–10:00 PM
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <p>© 2026 KrishiRakshak · Smart India Hackathon</p>
              <p className="text-emerald-300/80 font-medium">Agriculture, FoodTech & Rural Development</p>
            </div>
          </footer>

        </div>
      )}

      {/* Floating Mode Switcher Button [ 📰 Website | 📱 Mobile ] */}
      <FloatingViewToggle
        viewMode={viewMode}
        onToggle={setViewMode}
      />

      {/* Interactive Modals */}
      <LabReferralModal
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
      />

      <AddFieldModal
        isOpen={isAddFieldOpen}
        onClose={() => setIsAddFieldOpen(false)}
        onAddField={handleAddField}
      />

    </div>
  );
};
