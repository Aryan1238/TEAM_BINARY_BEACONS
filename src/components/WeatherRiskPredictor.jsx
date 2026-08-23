import React, { useState, useEffect } from 'react';
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
  Info,
  Navigation,
  Radio,
  ExternalLink
} from 'lucide-react';
import { AGRICULTURAL_REGIONS, fetchLiveWeather } from '../services/weatherService';
import { getUiTranslation } from '../data/uiTranslations';
import { districtForecasts, calculateBlitecastSeverity } from '../data/weatherEpidemiology';

export const WeatherRiskPredictor = ({ currentLang, onNavigate, onSelectDiseaseForIPM }) => {
  const t = getUiTranslation(currentLang).weather;
  const [selectedRegionId, setSelectedRegionId] = useState('Nashik');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModelTab, setActiveModelTab] = useState('blitecast');
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Fetch live weather data
  const loadWeather = async (lat, lon, name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveWeather(lat, lon, name);
      setWeatherData(data);
    } catch (err) {
      console.warn('Live weather API error, falling back to cached epidemiology forecast:', err);
      setError('Live weather connection timed out. Showing calibrated backup forecast.');
      const fallback = districtForecasts[name] || districtForecasts.Nashik;
      setWeatherData({
        ...fallback,
        isLive: false,
        lastUpdated: 'Cached Backup Model'
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when region changes
  useEffect(() => {
    const region = AGRICULTURAL_REGIONS.find(r => r.id === selectedRegionId) || AGRICULTURAL_REGIONS[0];
    loadWeather(region.lat, region.lon, region.name);
    setIsGpsActive(false);
  }, [selectedRegionId]);

  // Handle GPS Auto-detect
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsActive(true);
        loadWeather(pos.coords.latitude, pos.coords.longitude, 'Current GPS Farm Location');
      },
      (err) => {
        console.warn('GPS permission denied:', err);
        alert('Could not access GPS location. Please select your agricultural district manually.');
        setLoading(false);
      }
    );
  };

  const currentRegion = AGRICULTURAL_REGIONS.find(r => r.id === selectedRegionId) || AGRICULTURAL_REGIONS[0];
  const forecast = weatherData || districtForecasts.Nashik;
  const blitecast = calculateBlitecastSeverity(forecast.temp, forecast.humidity, forecast.leafWetnessHours);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header Title & Agricultural Region Selector */}
        <div className="bg-[#0F382A] rounded-2xl p-5 sm:p-7 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-400 text-blue-950 flex items-center space-x-1">
                <Radio className="w-3 h-3 text-blue-900 animate-pulse mr-0.5" />
                <span>Pillar 2: Live Microclimate Epidemiology</span>
              </span>
              <span className="text-xs text-emerald-300 font-mono">Open-Meteo Real-Time Ingestion</span>
              {weatherData?.isLive && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ● Live Telemetry
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Weather & Context-Based Disease Outbreak Forecaster
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Real-time atmospheric telemetry calculating fungal sporulation vectors, insect degree-day thresholds, and safe spray windows for Indian agricultural zones.
            </p>
          </div>

          {/* District & GPS Selector Bar */}
          <div className="bg-[#071F17] rounded-2xl p-4 border border-emerald-800 shrink-0 space-y-2.5 max-w-md w-full lg:w-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Farm Location:</span>
              </span>
              
              <button
                onClick={handleUseGps}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                  isGpsActive ? 'bg-amber-400 text-emerald-950 font-extrabold shadow' : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                }`}
                title="Detect exact coordinates via device GPS"
              >
                <Navigation className="w-3 h-3" />
                <span>Auto GPS</span>
              </button>
            </div>

            {/* Region Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-[#0F382A] text-white border border-emerald-700 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <optgroup label="Maharashtra Agricultural Hubs">
                  {AGRICULTURAL_REGIONS.filter(r => r.state === 'Maharashtra').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.crop}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Punjab & North India">
                  {AGRICULTURAL_REGIONS.filter(r => r.state === 'Punjab').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.state}) — {r.crop}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="South India (Karnataka, AP, TN, Kerala)">
                  {AGRICULTURAL_REGIONS.filter(r => ['Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'].includes(r.state)).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.state}) — {r.crop}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="West & East India (Gujarat, WB, Odisha)">
                  {AGRICULTURAL_REGIONS.filter(r => ['Gujarat', 'West Bengal', 'Odisha'].includes(r.state)).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.state}) — {r.crop}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Last Updated Timestamp & Refresh */}
            <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 font-mono">
              <span>Updated: {forecast.lastUpdated || 'Live Sync'}</span>
              <button
                onClick={() => loadWeather(currentRegion.lat, currentRegion.lon, currentRegion.name)}
                className="hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-amber-300 p-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-mono animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Fetching real-time agrometeorology weather telemetry from Open-Meteo stations...</span>
          </div>
        )}

        {/* Error / Fallback Alert */}
        {error && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-xl flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadWeather(currentRegion.lat, currentRegion.lon, currentRegion.name)}
              className="underline font-bold text-amber-950 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live Regional Conditions Grid (6 Live Telemetry Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Ambient Temp</span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {forecast.temp}°C
            </span>
            <span className="text-[10px] text-slate-500 font-medium">{forecast.weatherDesc || 'Real-time'}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Rel. Humidity</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-extrabold text-blue-700 font-mono block">
              {forecast.humidity}%
            </span>
            <span className={`text-[10px] font-bold ${forecast.humidity >= 85 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {forecast.humidity >= 85 ? 'Critical > 85% RH' : 'Manageable RH'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Leaf Wetness</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-700 font-mono block">
              {forecast.leafWetnessHours} hrs
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Spore germination index</span>
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
            <span className={`text-[10px] font-medium ${forecast.windSpeedKmH <= 12 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {forecast.windSpeedKmH <= 12 ? '< 12 km/h (Low Drift)' : 'Drift Warning'}
            </span>
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
            forecast.safeSprayToday?.safe 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  forecast.safeSprayToday?.safe 
                    ? 'bg-emerald-200 text-emerald-900' 
                    : 'bg-rose-200 text-rose-900'
                }`}>
                  {forecast.safeSprayToday?.safe ? '✅ SAFE SPRAY WINDOW ACTIVE' : '⛔ UNSAFE SPRAY WINDOW'}
                </span>
                <span className="text-xs text-slate-500 font-mono">Feasibility Engine</span>
              </div>

              <h3 className={`text-xl font-bold ${
                forecast.safeSprayToday?.safe ? 'text-emerald-950' : 'text-rose-950'
              }`}>
                {forecast.safeSprayToday?.safe 
                  ? 'Optimal Weather for Chemical & Bio Applications' 
                  : 'High Risk of Rain Washoff or Spray Drift'}
              </h3>

              <p className={`text-xs leading-relaxed ${
                forecast.safeSprayToday?.safe ? 'text-emerald-800' : 'text-rose-800'
              }`}>
                {forecast.safeSprayToday?.reason}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Wind: {forecast.windSpeedKmH} km/h · Rain: {forecast.rainfallProb}%</span>
              <button
                onClick={() => onNavigate('ipm')}
                className="font-bold text-emerald-900 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Calculate Precision Dosage &rarr;</span>
              </button>
            </div>
          </div>

          {/* Live Pathogen Risk Triggers */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Pathogen Outbreak Vulnerability
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Dynamic Epidemic Model</span>
            </div>

            <div className="space-y-2.5">
              {(forecast.diseaseRisks || []).map((dr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{dr.disease}</span>
                    <span className="text-[11px] text-slate-500">{dr.trigger}</span>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                      dr.risk >= 80 ? 'bg-rose-100 text-rose-800' : dr.risk >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {dr.status} ({dr.risk}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 7-Day Outbreak Window Trajectory */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>7-Day Predictive Outbreak Window ({forecast.district})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Daily temperature range, precipitation probability, and calculated epidemiological sporulation index.
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-900 font-mono font-bold self-start sm:self-auto">
              Open-Meteo High-Resolution Model
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(forecast.sevenDayForecast || []).map((day, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                  day.riskScore >= 75 
                    ? 'bg-rose-50/60 border-rose-200' 
                    : day.status === 'Safe Window' 
                      ? 'bg-emerald-50/60 border-emerald-200 shadow-sm' 
                      : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                  <span>{day.day}</span>
                  {day.rainProb > 50 ? <CloudRain className="w-3.5 h-3.5 text-blue-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </div>

                <div className="space-y-0.5 text-xs font-mono">
                  <div className="text-slate-900 font-bold">
                    {day.tempHigh}° / <span className="text-slate-500">{day.tempLow}°C</span>
                  </div>
                  <div className="text-[11px] text-blue-700">
                    Rain: {day.rainProb}% ({day.rainMm}mm)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    day.riskScore >= 75 ? 'bg-rose-200 text-rose-900' : day.status === 'Safe Window' ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {day.status}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600">{day.riskScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
