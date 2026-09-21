import React, { useState } from 'react';
import { 
  Building, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  RefreshCw, 
  Package, 
  Radio, 
  Download, 
  MapPin, 
  CheckCircle2,
  Database,
  Sliders,
  Check,
  Activity,
  Sparkles,
  Wind,
  Zap
} from 'lucide-react';
import { maharashtraDistricts } from '../data/maharashtraGeo';
import confetti from 'canvas-confetti';
import { useDiagnosis } from '../context/DiagnosisContext';
import { useCountUp } from '../hooks/useCountUp';
import { getUiTranslation } from '../data/uiTranslations';

// ─── Seeded monsoon wind directions per district (fixed, not random) ───
const DISTRICT_WIND = {
  'Nashik':       { dir: 'NE', angleDeg: 45,  cx: 55, cy: 30 },
  'Yavatmal':     { dir: 'SW', angleDeg: 225, cx: 72, cy: 72 },
  'Amravati':     { dir: 'SW', angleDeg: 225, cx: 78, cy: 52 },
  'Jalgaon':      { dir: 'NE', angleDeg: 45,  cx: 48, cy: 18 },
  'Pune':         { dir: 'W',  angleDeg: 270, cx: 38, cy: 55 },
  'Ahmednagar':   { dir: 'NW', angleDeg: 315, cx: 45, cy: 42 },
  'Kolhapur':     { dir: 'SW', angleDeg: 225, cx: 28, cy: 72 },
  'Aurangabad':   { dir: 'E',  angleDeg: 90,  cx: 58, cy: 45 },
};

const CONE_HALF_ANGLE = 35; // degrees spread on each side of wind direction

/** Compute SVG arc path for a spread cone centered at (cx%, cy%) */
function coneArc(cx, cy, angleDeg, radius, halfAngle) {
  const toRad = d => (d * Math.PI) / 180;
  const a1 = toRad(angleDeg - halfAngle);
  const a2 = toRad(angleDeg + halfAngle);
  const x1 = cx + radius * Math.cos(a1);
  const y1 = cy + radius * Math.sin(a1);
  const x2 = cx + radius * Math.cos(a2);
  const y2 = cy + radius * Math.sin(a2);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

// ─── Govt Buffer Stock Data (reactive state) ───
const INITIAL_STOCKS = [
  { id: 'cop', molecule: 'Copper Oxychloride 50 WP', stockPct: 84, district: 'Nashik / Pune', target: 'Fungal diseases' },
  { id: 'tri', molecule: 'Trichoderma viride 2% WP', stockPct: 72, district: 'Amravati / Kolhapur', target: 'Soil-borne pathogens' },
  { id: 'chl', molecule: 'Chlorantraniliprole 18.5 SC', stockPct: 28, district: 'Yavatmal / Jalgaon', target: 'Cotton bollworm / Lepidoptera' },
  { id: 'bea', molecule: 'Beauveria bassiana 1.15% WP', stockPct: 65, district: 'Solapur / Sangli', target: 'Whitefly / Thrips' },
];

export const GovtCommandCenter = ({ currentLang, onNavigate }) => {
  const t = getUiTranslation(currentLang).govt || {};
  const { govtAggregates, latestDiagnosis } = useDiagnosis();
  const [retrainingStatus, setRetrainingStatus] = useState('Idle (PyTorch EfficientNet-B0 v2.4.1 Production Checkpoint)');
  const [isRetraining, setIsRetraining] = useState(false);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [procurementAlerts, setProcurementAlerts] = useState({});

  // Animated live KPI counters
  const animatedLiveDiagnoses = useCountUp(govtAggregates.liveDiagnosesCount);
  const animatedLiveCritical = useCountUp(govtAggregates.liveCriticalCount);
  const animatedLiveHighPriority = useCountUp(govtAggregates.liveHighPriorityCount);

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setRetrainingStatus('Step 1/3: Ingesting verified ground-truth annotations from extension officers (Trust Score ≥ 80)...');
    setTimeout(() => {
      setRetrainingStatus('Step 2/3: Simulating offline benchmark evaluation against 100% leakage-safe split...');
      setTimeout(() => {
        setIsRetraining(false);
        setRetrainingStatus('Simulation Complete: EfficientNet-B0 v2.4.1 Checkpoint Verified & Ready for Deployment');
        confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
      }, 1500);
    }, 1400);
  };

  const handleEmergencyProcurement = (id, molecule) => {
    setProcurementAlerts(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setProcurementAlerts(prev => ({ ...prev, [id]: false }));
    }, 4000);
  };

  // Find top-2 critical districts for spread cone rendering
  const criticalDistricts = maharashtraDistricts
    .filter(d => d.riskLevel === 'Critical')
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── Header ── */}
        <div className="bg-[#0F382A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-900 font-mono">
                {t.pillarTag || 'Pillar 5: State Command & Governance'}
              </span>
              <span className="text-xs text-emerald-300 font-mono">{t.deptTitle || 'Government of Maharashtra Agriculture Department'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.title || 'State-Wide Epidemic Surveillance Command Center'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.subtitle || 'Macro-epidemiology monitoring across 8 pilot districts, supply-chain input buffer management, and automated Active Learning model continuous retraining.'}
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('hotspots')}
              className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-5 py-3 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Live Hotspot GIS</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────── */}
        {/* MACRO KPI STRIP                             */}
        {/* ─────────────────────────────────────────── */}
        <div id="govt-kpis" className="scroll-mt-24 rounded-3xl bg-white p-6 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-700" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Real-Time PyTorch Diagnosis Ingestion Stream</h2>
                <p className="text-xs text-slate-500">Aggregated telemetry calculated strictly from live farmer and officer diagnostic sessions.</p>
              </div>
            </div>
            {govtAggregates.hasLiveDiagnoses ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Live Ingestion Stream Active ({govtAggregates.liveDiagnosesCount} Logged)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                Awaiting Live Farmer Diagnoses · Showing Baseline Telemetry Below
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl p-4 bg-emerald-50/60 border border-emerald-200/80 hover:shadow-sm transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">{t.kpiLive || 'Live Diagnoses Ingested'}</span>
              <span className="text-3xl font-extrabold text-emerald-950 font-mono block mt-1">{animatedLiveDiagnoses}</span>
              <span className="text-[11px] text-emerald-700 font-medium">{govtAggregates.hasLiveDiagnoses ? 'Synchronized with session' : 'Standby for camera/upload scans'}</span>
            </div>
            <div className="rounded-2xl p-4 bg-rose-50/60 border border-rose-200/80 hover:shadow-sm transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 block">{t.kpiCritical || 'Live Critical Outbreaks'}</span>
              <span className={`text-3xl font-extrabold text-rose-600 font-mono block mt-1 ${govtAggregates.liveCriticalCount > 0 ? 'animate-pulse' : ''}`}>{animatedLiveCritical}</span>
              <span className="text-[11px] text-rose-700 font-medium">{govtAggregates.liveCriticalCount > 0 ? 'Field verification flagged' : 'No critical flags'}</span>
            </div>
            <div className="rounded-2xl p-4 bg-orange-50/60 border border-orange-200/80 hover:shadow-sm transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900 block">High Priority Alerts</span>
              <span className="text-3xl font-extrabold text-orange-600 font-mono block mt-1">{animatedLiveHighPriority}</span>
              <span className="text-[11px] text-orange-700 font-medium">Officer verification scheduled</span>
            </div>
            <div className="rounded-2xl p-4 bg-blue-50/60 border border-blue-200/80 hover:shadow-sm transition-shadow">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">Affected Crop Species</span>
              <span className="text-3xl font-extrabold text-blue-950 font-mono block mt-1">{govtAggregates.affectedCropsCount}</span>
              <span className="text-[11px] text-blue-700 font-medium truncate block">{govtAggregates.affectedCrops.length > 0 ? govtAggregates.affectedCrops.join(', ') : 'All crop species stable'}</span>
            </div>
          </div>
        </div>

        {/* Baseline KPI Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">State Historical Surveillance & Baseline Telemetry (Demo Archive)</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Macro Pilot Benchmark</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Field Diagnoses (Historical)', value: (48290 + govtAggregates.liveDiagnosesCount).toLocaleString('en-IN'), sub: '+28% vs previous month', color: 'text-slate-900', subColor: 'text-emerald-600' },
              { label: 'Active Quarantine Clusters', value: '6 Clusters', sub: 'Yavatmal Pink Bollworm Red Alert', color: 'text-rose-600', subColor: 'text-rose-600' },
              { label: 'Estimated Crop Value Protected', value: '₹ 14.8 Cr', sub: 'across 8 pilot districts', color: 'text-emerald-700', subColor: 'text-emerald-600' },
              { label: 'KVK Agreement (DEMO / BASELINE)', value: '96.8%', sub: '18 KVK Centers Connected', color: 'text-blue-700', subColor: 'text-blue-600' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1 hover:shadow-sm transition-shadow">
                <span className="text-xs text-slate-500 font-medium block">{kpi.label}</span>
                <span className={`text-3xl font-extrabold font-mono block ${kpi.color}`}>{kpi.value}</span>
                <span className={`text-[11px] font-bold ${kpi.subColor}`}>{kpi.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────── */}
        {/* ─────────────────────────────────────────── */}
        {/* TWO-COLUMN: TABLE + SPREAD CONE / STOCK    */}
        {/* ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: District Surveillance Table & Continuous Learning Architecture */}
          <div className="lg:col-span-7 space-y-6">
            <div id="govt-table" className="scroll-mt-24 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base font-bold text-slate-900">{t.districtRegisterTitle || 'District Outbreak & Surveillance Breakdown'} (DEMO / BASELINE)</h2>
                </div>
                <button
                  onClick={() => alert('Downloading official Maharashtra crop epidemiology report PDF...')}
                  className="text-xs text-emerald-800 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export State Report</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Primary Pathogen</th>
                      <th className="py-2.5 px-3">Active Cases</th>
                      <th className="py-2.5 px-3">Wind</th>
                      <th className="py-2.5 px-3">Risk</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {maharashtraDistricts.map((dist) => {
                      const wind = DISTRICT_WIND[dist.name] || { dir: '—' };
                      return (
                        <tr key={dist.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{dist.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{dist.marathiName}</span>
                          </td>
                          <td className="py-3 px-3 text-[11px] max-w-[130px] truncate">{dist.majorDisease}</td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{dist.activeCases}</td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{wind.dir}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dist.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                              dist.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {dist.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => onNavigate('hotspots')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              View GIS
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Active Learning Pipeline Architecture (DEMO / SIMULATION) ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">{t.retrainTitle || 'Continuous Learning Pipeline Architecture'}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 font-mono">
                  CONCEPTUAL ARCHITECTURE (DEMO)
                </span>
              </div>

              {/* Explanatory Banner */}
              <div className="rounded-2xl bg-purple-50/80 border border-purple-200/80 p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-purple-950 space-y-1">
                    <p className="font-bold">Automated Continuous Improvement Lifecycle (Supervised Airflow/Kubeflow Flow)</p>
                    <p className="text-[11px] text-purple-900/90 leading-relaxed">
                      In production deployment, client-side browsers and mobile apps do <span className="font-bold underline">not</span> retrain neural weights directly. Instead, verified field diagnoses from high-credibility extension officers (Trust Score ≥ 80) are ingested into an offline Airflow/Kubeflow pipeline for supervised verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Pipeline Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">1. Field Telemetry Queue</span>
                    <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">1,240 Samples</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Unlabeled and borderline foliar scans flagged by officers.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">2. Quality & Leakage Gate</span>
                    <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Passed</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Laplacian blur variance check & strict train/test split isolation.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">3. Scheduled Batch Job</span>
                    <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Airflow / Kubeflow</span>
                  </div>
                  <p className="text-[10px] text-slate-500">GPU batch fine-tuning on regional Maharashtra variants.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">4. Checkpoint Promotion</span>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">ICAR / KVK Sign-Off</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Automated canary release with zero service downtime.</p>
                </div>
              </div>

              {/* Status Box & Simulation Trigger */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="font-bold text-slate-700">Orchestrator Simulation Status:</span>
                  <span className="font-mono font-bold text-emerald-800 text-[11px] truncate">{retrainingStatus}</span>
                </div>
              </div>

              <button
                onClick={handleTriggerRetrain}
                disabled={isRetraining}
                className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-2xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isRetraining ? 'animate-spin' : ''}`} />
                <span>{isRetraining ? 'Simulating Pipeline Orchestration Flow...' : 'Simulate Pipeline Orchestration Flow (Demo)'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Spread Cone + Stock */}
          <div className="lg:col-span-5 space-y-6">

            {/* ── Spread Cone SVG Visualization ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    {t.spreadGridTitle || 'Spread Cone Predictor'}
                    <span className="text-[10px] text-slate-500 ml-2 font-normal">(DEMO / BASELINE)</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">3-Day Risk</span>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-[10px] text-slate-600 mb-2">
                Seeded Maharashtra monsoon wind directions. Cones show predicted 3-day pathogen spread trajectory based on wind + humidity. Critical districts emit larger cones.
                <span className="ml-1 text-rose-600 font-bold">[DEMO / BASELINE] Epidemiological Spread Simulation — not real-time GIS data.</span>
              </div>

              {/* SVG District Grid */}
              <svg viewBox="0 0 100 100" className="w-full h-64 rounded-2xl bg-[#E8F5F0]" style={{ fontFamily: 'monospace' }}>
                {/* District nodes + wind cones */}
                {Object.entries(DISTRICT_WIND).map(([name, info]) => {
                  const dist = maharashtraDistricts.find(d => d.name === name);
                  const isCritical = dist?.riskLevel === 'Critical';
                  const isHigh = dist?.riskLevel === 'High';
                  const coneColor = isCritical ? 'rgba(239,68,68,0.2)' : isHigh ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.1)';
                  const coneBorder = isCritical ? 'rgba(239,68,68,0.6)' : isHigh ? 'rgba(245,158,11,0.5)' : 'rgba(52,211,153,0.4)';
                  const nodeColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';
                  const coneRadius = isCritical ? 22 : isHigh ? 16 : 10;

                  return (
                    <g key={name}>
                      {/* Wind spread cone */}
                      <path
                        d={coneArc(info.cx, info.cy, info.angleDeg, coneRadius, CONE_HALF_ANGLE)}
                        fill={coneColor}
                        stroke={coneBorder}
                        strokeWidth="0.3"
                        opacity="0.85"
                      />
                      {/* District node */}
                      <circle cx={info.cx} cy={info.cy} r={isCritical ? 3.5 : 2.5} fill={nodeColor} opacity="0.9" />
                      {/* Wind direction label */}
                      <text x={info.cx + 4} y={info.cy - 3.5} fontSize="2.5" fill="#475569" fontWeight="bold">{info.dir}</text>
                      {/* District name */}
                      <text x={info.cx} y={info.cy + 5.5} fontSize="2.2" fill="#1e293b" textAnchor="middle" fontWeight="600">{name}</text>
                    </g>
                  );
                })}
                {/* Legend */}
                <g transform="translate(2, 88)">
                  <circle cx="2" cy="2" r="1.5" fill="#ef4444" />
                  <text x="5" y="3.2" fontSize="2.2" fill="#475569">Critical</text>
                  <circle cx="22" cy="2" r="1.5" fill="#f59e0b" />
                  <text x="25" y="3.2" fontSize="2.2" fill="#475569">High</text>
                  <circle cx="40" cy="2" r="1.5" fill="#10b981" />
                  <text x="43" y="3.2" fontSize="2.2" fill="#475569">Monitored</text>
                </g>
              </svg>

              <div className="text-[10px] text-slate-500 italic text-center">
                Cone arc direction = seeded monsoon wind · Cone size ∝ district risk level · Nashik (NE), Yavatmal (SW), Amravati (SW), Jalgaon (NE), Pune (W), Ahmednagar (NW), Kolhapur (SW), Aurangabad (E)
              </div>
            </div>

            {/* ── Input Buffer Stock Auto-Alert ── */}
            <div id="govt-stock" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow scroll-mt-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    {t.bufferStockTitle || 'District Input Buffer Stockpile'} (DEMO / BASELINE)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Baseline Inventory</span>
              </div>

              <div className="space-y-3">
                {stocks.map((item) => {
                  const isLow = item.stockPct <= 28;
                  const isMedium = item.stockPct > 28 && item.stockPct < 50;
                  const alertSent = procurementAlerts[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border text-xs space-y-2 transition-all hover:shadow-sm ${
                        isLow
                          ? 'bg-rose-50 border-rose-300 shadow-rose-100 shadow-sm'
                          : isMedium
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.molecule}</span>
                          <span className="text-[10px] text-slate-500">Target: {item.target}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                            isLow ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                            isMedium ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {item.stockPct}% {isLow ? '— 🚨 LOW' : isMedium ? '— ⚠️ Monitor' : '— Adequate'}
                          </span>
                        </div>
                      </div>

                      {/* Stock bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? 'bg-rose-500' : isMedium ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.stockPct}%` }}
                        />
                      </div>

                      <span className="text-[10px] text-slate-500 block">Warehouses: {item.district}</span>

                      {/* Auto-alert + procurement button for low stock */}
                      {isLow && (
                        <div className="space-y-1.5">
                          <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 text-[10px] text-rose-800 font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                            AUTO-ALERT: Stock at or below 28% reorder threshold. Procurement advisory generated.
                          </div>
                          <button
                            onClick={() => handleEmergencyProcurement(item.id, item.molecule)}
                            disabled={alertSent}
                            className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 transition-all"
                          >
                            <Zap className="w-3 h-3" />
                            {alertSent ? '✓ Emergency Procurement Order Sent' : 'Trigger Emergency Procurement'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
