import React from 'react';
import {
  ArrowRight,
  CloudRain,
  Leaf,
  MapPin,
  ScanLine,
  ShieldAlert,
  Sparkles,
  ThermometerSun,
  Timer,
} from 'lucide-react';

const getRisk = (score = 0, status = '') => {
  if (status === 'At Risk' || score < 65) return 'HIGH';
  if (status === 'Monitored' || score < 85) return 'WATCH';
  return 'LOW';
};

const riskStyles = {
  LOW: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Stable',
  },
  WATCH: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Watch',
  },
  HIGH: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Attention',
  },
};

export const FarmCommandCenter = ({
  farmer,
  fields = [],
  recentScans = [],
  onNavigate,
  onSelectField,
}) => {
  const averageHealth = fields.length
    ? Math.round(
        fields.reduce((sum, field) => sum + Number(field.healthScore || 0), 0) /
          fields.length
      )
    : 0;

  const atRiskFields = fields.filter(
    (field) => getRisk(field.healthScore, field.status) === 'HIGH'
  );

  const latestScan = recentScans[0] || null;
  const latestField =
    [...fields].sort(
      (a, b) =>
        Number(b.healthScore || 0) - Number(a.healthScore || 0)
    )[0] || null;

  const overallRisk =
    averageHealth < 65 ? 'HIGH' : averageHealth < 85 ? 'WATCH' : 'LOW';

  const risk = riskStyles[overallRisk];

  return (
    <section className="mb-7">
      <div className="rounded-[28px] overflow-hidden bg-[#0B3D2A] border border-emerald-900/20 shadow-xl">
        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-emerald-400/10 border border-emerald-300/15 text-emerald-200 text-[10px] font-extrabold uppercase tracking-[0.18em]">
                <Sparkles className="w-3.5 h-3.5" />
                Farm Command Center
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {farmer?.name ? `${farmer.name}'s Farm` : 'Your Farm'}
              </h2>

              <p className="mt-1 text-sm text-emerald-100/75">
                One view for field health, disease signals and the next action.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-100/75">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>{farmer?.location || 'Field location'}</span>
            </div>
          </div>
        </div>

        {/* Main metrics */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-emerald-100/60 font-semibold">
                  Farm Health
                </span>
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">
                  {averageHealth}%
                </span>
                <span className={`mb-1 text-[10px] font-bold px-2 py-1 rounded-full border ${risk.badge}`}>
                  {risk.label}
                </span>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full ${
                    overallRisk === 'HIGH'
                      ? 'bg-rose-400'
                      : overallRisk === 'WATCH'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, averageHealth))}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-emerald-100/60 font-semibold">
                  Fields
                </span>
                <MapPin className="w-4 h-4 text-sky-300" />
              </div>

              <div className="mt-2 text-3xl font-bold text-white">
                {fields.length}
              </div>

              <p className="mt-1 text-xs text-emerald-100/65">
                {atRiskFields.length} need attention
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-emerald-100/60 font-semibold">
                  Latest Signal
                </span>
                <ScanLine className="w-4 h-4 text-amber-300" />
              </div>

              <div className="mt-2 text-lg font-bold text-white truncate">
                {latestScan?.disease || 'No diagnosis yet'}
              </div>

              <p className="mt-1 text-xs text-emerald-100/65">
                {latestScan
                  ? `${latestScan.confidence}% confidence · ${latestScan.time}`
                  : 'Run a crop scan to create the first evidence point.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-emerald-100/60 font-semibold">
                  Next Move
                </span>
                <Timer className="w-4 h-4 text-amber-300" />
              </div>

              <div className="mt-2 text-lg font-bold text-white">
                {atRiskFields.length ? 'Inspect field' : 'Keep monitoring'}
              </div>

              <p className="mt-1 text-xs text-emerald-100/65">
                Based on current field-health state.
              </p>
            </div>
          </div>

          {/* Attention lane */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-3">
            <div className="rounded-2xl bg-[#082F20] border border-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-300" />
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    What needs attention now?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate?.('diagnosis')}
                  className="text-[11px] font-semibold text-emerald-200 hover:text-white transition"
                >
                  Scan crop →
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fields.slice(0, 2).map((field) => {
                  const fieldRisk = getRisk(field.healthScore, field.status);
                  const styles = riskStyles[fieldRisk];

                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => onSelectField?.(field)}
                      className="text-left rounded-xl bg-white/[0.045] hover:bg-white/[0.08] border border-white/10 p-3 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {field.name}
                          </p>
                          <p className="text-[11px] text-emerald-100/55 mt-0.5">
                            {field.crop} · {field.acres} acres
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${styles.badge}`}
                        >
                          {field.healthScore}%
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-100/55">
                          {field.lastScanned}
                        </span>
                        <span className="text-emerald-200 font-semibold">
                          {fieldRisk === 'HIGH' ? 'Inspect' : 'View'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick actions
              </p>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigate?.('diagnosis')}
                  className="w-full flex items-center justify-between rounded-xl bg-[#0F5137] text-white px-3.5 py-3 text-sm font-semibold hover:bg-[#0B3D2A] transition"
                >
                  <span className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4" />
                    Scan a crop
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate?.('weather')}
                  className="w-full flex items-center justify-between rounded-xl bg-sky-50 text-sky-800 border border-sky-100 px-3.5 py-3 text-sm font-semibold hover:bg-sky-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4" />
                    Check weather risk
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate?.('hotspots')}
                  className="w-full flex items-center justify-between rounded-xl bg-amber-50 text-amber-800 border border-amber-100 px-3.5 py-3 text-sm font-semibold hover:bg-amber-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <ThermometerSun className="w-4 h-4" />
                    Open hotspot view
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Focus field */}
          {latestField && (
            <button
              type="button"
              onClick={() => onSelectField?.(latestField)}
              className="mt-3 w-full text-left rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-4 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/60 font-bold">
                    Focus field
                  </p>
                  <p className="text-base font-bold text-white mt-1">
                    {latestField.name}
                  </p>
                  <p className="text-xs text-emerald-100/60 mt-1">
                    {latestField.crop} · {latestField.acres} acres · last checked {latestField.lastScanned}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-300/10 border border-emerald-200/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                  Open passport
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
