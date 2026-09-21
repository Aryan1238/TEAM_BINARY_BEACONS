import React from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CloudRain,
  Droplets,
  Leaf,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Thermometer,
  UserCheck,
  Calculator,
  Sparkles
} from 'lucide-react';
import { useDiagnosis } from '../context/DiagnosisContext';
import { cropDiseases } from '../data/cropDiseases';

const getHealthState = (score = 0) => {
  if (score >= 85) {
    return {
      label: 'Healthy',
      tone: 'emerald',
      description: 'Field is currently showing a stable crop-health profile.',
    };
  }

  if (score >= 65) {
    return {
      label: 'Watch',
      tone: 'amber',
      description: 'Some signals need monitoring and a follow-up check.',
    };
  }

  return {
    label: 'At Risk',
    tone: 'rose',
    description: 'Field requires attention and a timely follow-up.',
  };
};

const toneMap = {
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    panel: 'bg-emerald-50/70 border-emerald-100',
    accent: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    panel: 'bg-amber-50/70 border-amber-100',
    accent: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  rose: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    panel: 'bg-rose-50/70 border-rose-100',
    accent: 'text-rose-700',
    bar: 'bg-rose-500',
  },
};

export const FieldHealthPassport = ({
  field,
  recentScans = [],
  onClose,
  onNavigate,
}) => {
  const { setSelectedDisease } = useDiagnosis();

  if (!field) return null;

  const health = getHealthState(field.healthScore);
  const tone = toneMap[health.tone];

  const fieldScans = recentScans
    .filter((scan) => scan.crop?.toLowerCase() === field.crop?.split(' ')[0]?.toLowerCase())
    .slice(0, 5);

  const latestScan = fieldScans[0] || recentScans[0] || null;

  const riskScore = Math.max(
    0,
    Math.min(
      100,
      100 - (Number(field.healthScore) || 0) + (latestScan?.severity === 'High' || latestScan?.priority === 'CRITICAL' ? 20 : 0)
    )
  );

  const steps = [
    { key: 'Scan Completed', label: 'Scan Completed', desc: 'PyTorch inference' },
    { key: 'Disease Identified', label: 'Disease Identified', desc: latestScan?.disease || 'Foliar pathology' },
    { key: 'Priority Assigned', label: 'Priority Assigned', desc: latestScan?.priority || health.label },
    { key: 'Advisory Generated', label: 'Advisory Generated', desc: 'CIBRC IPM rules' },
    { key: 'Follow-up Required', label: 'Follow-up / Monitored', desc: 'Field observation' }
  ];

  const currentStepIdx = steps.findIndex(s => s.key === (latestScan?.timelineStep || 'Advisory Generated')) !== -1
    ? steps.findIndex(s => s.key === (latestScan?.timelineStep || 'Advisory Generated'))
    : 3;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/55 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-3xl bg-[#F8F6F0] shadow-2xl border border-white/60">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B3D2A] via-[#0F5137] to-[#164E3A] text-white p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm font-semibold mb-4 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to My Fields
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-200" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/80 font-semibold">
                        Crop Health Passport
                      </p>
                      {latestScan?.isLive && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded">
                          Live Verified
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {field.name}
                    </h2>
                    <p className="text-sm text-emerald-100/80 mt-1">
                      {field.crop} · {field.acres} acres
                    </p>
                  </div>
                </div>
              </div>

              <div className={`self-start px-3 py-2 rounded-full border text-sm font-bold ${tone.badge}`}>
                {health.label}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Health overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Current Health
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${tone.accent}`}>
                      {field.healthScore}%
                    </p>
                  </div>
                  <ShieldCheck className={`w-8 h-8 ${tone.accent}`} />
                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${tone.bar} transition-all`}
                    style={{ width: `${Math.max(0, Math.min(100, field.healthScore))}%` }}
                  />
                </div>

                <p className="text-sm text-slate-500 mt-3">
                  {health.description}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Disease Risk
                    </p>
                    <p className="text-3xl font-bold mt-2 text-slate-900">
                      {riskScore}/100
                    </p>
                  </div>
                  <CircleAlert className="w-8 h-8 text-amber-500" />
                </div>

                <p className="text-sm text-slate-500 mt-4">
                  Derived from plot health index and the latest verified foliar diagnostic signal.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Last Scan
                    </p>
                    <p className="text-lg font-bold mt-2 text-slate-900">
                      {field.lastScanned}
                    </p>
                  </div>
                  <CalendarDays className="w-8 h-8 text-emerald-600" />
                </div>

                <p className="text-sm text-slate-500 mt-4">
                  Regular foliar scan cadence ensures early epidemic containment.
                </p>
              </div>
            </div>

            {/* Stepped Field Health Action Timeline */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Field Health Action Progression
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Cadence: {field.lastScanned}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isCurrent
                            ? 'bg-[#0F5137] text-white ring-4 ring-emerald-100'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <p className={`mt-2 text-[10px] sm:text-xs font-bold leading-tight ${
                        isDone ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-500 hidden sm:block truncate max-w-[90px]">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* "Why This Case Is Prioritized" (if reasons exist) */}
            {latestScan?.priorityReasons?.length > 0 && (
              <div className="rounded-3xl p-5 border bg-amber-50/70 border-amber-200 text-amber-950 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider font-mono">
                      Why This Field Case Is Prioritized
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {latestScan.priority || 'EVALUATED'}
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs font-medium">
                  {latestScan.priorityReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 mt-0.5 shrink-0">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                {latestScan.recommendedNextAction && (
                  <div className="mt-3 pt-2 border-t border-amber-200/50 flex items-start gap-2 text-xs font-semibold">
                    <span className="text-amber-700 uppercase tracking-wider text-[10px]">Action:</span>
                    <span>{latestScan.recommendedNextAction}</span>
                  </div>
                )}
              </div>
            )}

            {/* Latest diagnosis & Action Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Latest diagnostic evidence
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {latestScan?.disease || 'No recent diagnosis'}
                    </h3>
                  </div>

                  {latestScan && (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {latestScan.confidence}% model confidence
                    </span>
                  )}
                </div>

                {latestScan ? (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Crop</p>
                      <p className="font-semibold mt-1">{latestScan.crop}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Severity</p>
                      <p className="font-semibold mt-1">{latestScan.severity || 'Moderate'}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Observed</p>
                      <p className="font-semibold mt-1">{latestScan.time}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                    No diagnostic record is currently attached to this field.
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate?.('diagnosis');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0F5137] px-4 py-2.5 text-white font-semibold hover:bg-[#0B3D2A] transition cursor-pointer text-xs"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Run Fresh Scan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const matched = cropDiseases.find(d => 
                        d.name.toLowerCase().includes((latestScan?.disease || '').toLowerCase()) || 
                        (latestScan?.disease || '').toLowerCase().includes(d.name.toLowerCase()) ||
                        d.crop.toLowerCase().includes((field.crop || '').toLowerCase())
                      );
                      if (matched) setSelectedDisease(matched);
                      onClose();
                      onNavigate?.('ipm');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 px-4 py-2.5 font-semibold hover:bg-purple-100 transition cursor-pointer text-xs"
                  >
                    <Calculator className="w-4 h-4 text-purple-700" />
                    Calculate IPM Dosage
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`[DEMO / BASELINE] Case for ${field.name} (${latestScan?.disease || 'Foliar Infection'}) logged for KVK Agronomist review. Ticket: DEMO-KVK-NSK-492.`);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 px-4 py-2.5 font-semibold hover:bg-amber-100 transition cursor-pointer text-xs"
                  >
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    Escalate to KVK
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate?.('weather');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer text-xs"
                  >
                    <CloudRain className="w-4 h-4" />
                    Check Weather
                  </button>
                </div>
              </div>

              {/* Action plan */}
              <div className="rounded-3xl bg-[#0B3D2A] text-white p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wider text-emerald-200/80 font-semibold">
                  Next action
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {latestScan?.recommendedNextAction || 'Keep the field under scheduled observation'}
                </h3>

                <div className="mt-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-sm text-emerald-50/90">
                      Review the latest diagnosis before any chemical intervention.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-sm text-emerald-50/90">
                      Check weather and spray-window conditions.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-sm text-emerald-50/90">
                      Schedule a follow-up scan after field action.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic History for This Plot */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Plot Diagnostic History
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Current field status</p>
                    <p className="text-sm text-slate-500">
                      {health.label} · Health score {field.healthScore}% · {field.lastScanned}
                    </p>
                  </div>
                </div>

                {fieldScans.map((scan) => (
                  <div key={scan.id} className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {scan.disease} detected
                      </p>
                      <p className="text-sm text-slate-500">
                        {scan.crop} · {scan.confidence}% confidence · {scan.time}
                      </p>
                    </div>
                  </div>
                ))}

                {fieldScans.length === 0 && (
                  <p className="text-sm text-slate-500">
                    More history will appear as field scans are recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Sprout className="w-4 h-4 text-emerald-600" />
              This passport follows the selected field and updates as new field evidence is recorded.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
