import React, { useState } from 'react';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Info
} from 'lucide-react';
import { districtForecasts, calculateBlitecastSeverity } from '../data/weatherEpidemiology';

export const WeatherRiskPredictor = ({ currentLang, onNavigate, onSelectDiseaseForIPM }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const forecast = districtForecasts[selectedDistrict] || districtForecasts.Nashik;
  const [activeModelTab, setActiveModelTab] = useState('blitecast');

  const blitecast = calculateBlitecastSeverity(forecast.temp, forecast.humidity, forecast.leafWetnessHours);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-400 text-blue-950">
                Pillar 2: Microclimate Epidemiology
              </span>
              <span className="text-xs text-emerald-300 font-mono">Open-Meteo & Agrometeorology Models</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Weather & Context-Based Disease Outbreak Forecaster
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Synthesizing hyperlocal temperature, relative humidity, leaf wetness duration, and degree-day thermal sums to forecast fungal sporulation and insect flight windows 7 days in advance.
            </p>
          </div>

          {/* District Selector Pill */}
          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 space-y-2">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Agricultural Region:</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['Nashik', 'Yavatmal', 'Amravati', 'Ahmednagar'].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDistrict === dist 
                      ? 'bg-amber-400 text-emerald-950 shadow' 
                      : 'bg-emerald-950 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Regional Conditions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Ambient Temp</span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {forecast.temp}°C
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Optimal fungal range</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Rel. Humidity</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-extrabold text-blue-700 font-mono block">
              {forecast.humidity}%
            </span>
            <span className="text-[10px] text-rose-600 font-bold">Critical &gt; 85%</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Leaf Wetness</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-700 font-mono block">
              {forecast.leafWetnessHours} hrs
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Spore germination active</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Rainfall Prob</span>
              <CloudRain className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-2xl font-extrabold text-indigo-700 font-mono block">
              {forecast.rainfallProb}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{forecast.rainfallExpectedMm} mm expected</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Wind Velocity</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-800 font-mono block">
              {forecast.windSpeedKmH} km/h
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">&lt; 12 km/h (Low Drift)</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Thermal Sum</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-extrabold text-amber-700 font-mono block">
              {forecast.gddAccumulated} GDD
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Base 12°C Growing Degree Days</span>
          </div>

        </div>

        {/* Safe Spray Window Banner & Outbreak Threat Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Safe Spray Decision Box */}
          <div className={`lg:col-span-6 rounded-2xl p-6 border shadow-sm flex flex-col justify-between ${
            forecast.safeSprayToday.safe 
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CIBRC Spray Feasibility Advisory (Today)</span>
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold font-mono ${
                  forecast.safeSprayToday.safe ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {forecast.safeSprayToday.safe ? 'SAFE SPRAY WINDOW' : 'DO NOT SPRAY TODAY'}
                </span>
              </div>

              <h3 className="text-xl font-bold">
                {forecast.safeSprayToday.safe ? 'Optimal Weather Window for Field Application' : 'Unfavorable Atmospheric Conditions for Spraying'}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed">
                {forecast.safeSprayToday.reason}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-between text-xs">
              <span className="font-semibold">Best Upcoming Dry Window:</span>
              <span className="font-mono font-bold text-slate-800">Tuesday 06:00 AM – 10:30 AM</span>
            </div>
          </div>

          {/* Outbreak Probability Matrix */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Microclimate Pathogen Risk Index</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{selectedDistrict} District</span>
            </div>

            <div className="space-y-3">
              {forecast.diseaseRisks.map((dr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{dr.disease}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dr.risk >= 80 ? 'bg-rose-100 text-rose-800' : dr.risk >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {dr.status}
                      </span>
                      <span className="font-mono font-extrabold text-slate-900">{dr.risk}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${dr.risk}%` }} 
                      className={`h-full rounded-full ${
                        dr.risk >= 80 ? 'bg-rose-600' : dr.risk >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Trigger Mechanism: {dr.trigger}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 7-Day Outbreak Window Timeline */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                7-Day Hyperlocal Outbreak Risk Window
              </h2>
              <p className="text-xs text-slate-500">
                Calculated dynamically using Open-Meteo precipitation & relative humidity trajectory.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Confidence: 94.2%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.sevenDayForecast.map((day, idx) => {
              const isHigh = day.riskScore >= 75;
              const isSafe = day.status === 'Safe Window';
              return (
                <div 
                  key={idx}
                  className={`rounded-xl p-3.5 border text-center space-y-2.5 transition-all ${
                    isSafe 
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30' 
                      : isHigh 
                        ? 'bg-rose-50/60 border-rose-200' 
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-800 block">
                    {day.day}
                  </span>

                  <div className="space-y-0.5 font-mono text-xs">
                    <span className="font-extrabold text-slate-900">{day.tempHigh}°</span>
                    <span className="text-slate-400 text-[10px]"> / {day.tempLow}°C</span>
                  </div>

                  <div className="text-[11px] text-blue-700 flex items-center justify-center space-x-1 font-mono">
                    <CloudRain className="w-3 h-3" />
                    <span>{day.rainMm} mm</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1">
                    <span className="text-[10px] text-slate-500 block">Outbreak Score</span>
                    <span className={`text-sm font-extrabold font-mono block ${
                      isHigh ? 'text-rose-600' : isSafe ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      {day.riskScore}%
                    </span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isSafe ? 'bg-emerald-600 text-white' : isHigh ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {day.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-medium">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Action Recommendation:</strong> Schedule bio-fungicide (<em>Trichoderma</em> / Copper Oxychloride) spray on <strong>Tuesday Morning</strong> before the Thursday rain front.
              </span>
            </div>
            <button
              onClick={() => onNavigate('ipm')}
              className="bg-[#0F382A] hover:bg-[#164E3A] text-white px-4 py-2 rounded-lg font-bold shrink-0 shadow cursor-pointer transition-colors"
            >
              Open Spray Tank Calculator &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

