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
  Check
} from 'lucide-react';
import { maharashtraDistricts } from '../data/maharashtraGeo';
import confetti from 'canvas-confetti';

export const GovtCommandCenter = ({ currentLang, onNavigate }) => {
  const [retrainingStatus, setRetrainingStatus] = useState('Idle (Model v2.4.1 Production)');
  const [isRetraining, setIsRetraining] = useState(false);

  const supplyChainStocks = [
    { molecule: 'Copper Oxychloride 50 WP', stockMetric: '84% (Adequate)', district: 'Nashik / Pune', status: 'Healthy' },
    { molecule: 'Trichoderma viride 2% WP', stockMetric: '72% (Adequate)', district: 'Amravati / Kolhapur', status: 'Healthy' },
    { molecule: 'Chlorantraniliprole 18.5 SC', stockMetric: '28% (Low Stock Alert)', district: 'Yavatmal / Jalgaon', status: 'Warning' },
    { molecule: 'Beauveria bassiana 1.15% WP', stockMetric: '65% (Adequate)', district: 'Solapur / Sangli', status: 'Healthy' }
  ];

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setRetrainingStatus('Ingesting 1,240 ground-truth samples...');
    
    setTimeout(() => {
      setRetrainingStatus('Fine-tuning ResNet-50 on Maharashtra variants...');
      setTimeout(() => {
        setIsRetraining(false);
        setRetrainingStatus('Active (Model v2.5.0 Deployed to Edge)');
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-900">
                Pillar 5: State Command & Governance
              </span>
              <span className="text-xs text-emerald-300 font-mono">Government of Maharashtra Agriculture Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              State-Wide Epidemic Surveillance Command Center
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Macro-epidemiology monitoring across 8 pilot districts, supply-chain input buffer management, and automated Active Learning model continuous retraining.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('hotspots')}
              className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] px-5 py-3 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Live Hotspot GIS</span>
            </button>
          </div>
        </div>

        {/* State-Level Macro KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Total Field Diagnoses</span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono block">48,290</span>
            <span className="text-[11px] text-emerald-600 font-bold">+28% vs previous month</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Active Hotspots Under Quarantine</span>
            <span className="text-3xl font-extrabold text-rose-600 font-mono block">6 Clusters</span>
            <span className="text-[11px] text-rose-600 font-bold">Yavatmal Pink Bollworm Red Alert</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Estimated Crop Value Protected</span>
            <span className="text-3xl font-extrabold text-emerald-700 font-mono block">₹ 14.8 Cr</span>
            <span className="text-[11px] text-emerald-600 font-bold">across 8 pilot districts</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium block">KVK Validation Agreement</span>
            <span className="text-3xl font-extrabold text-blue-700 font-mono block">96.8%</span>
            <span className="text-[11px] text-blue-600 font-bold">18 KVK Centers Connected</span>
          </div>

        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: District Epidemiology Surveillance Table */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  District Outbreak & Surveillance Breakdown
                </h2>
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
                    <th className="py-2.5 px-3">Risk Rating</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {maharashtraDistricts.map((dist) => (
                    <tr key={dist.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{dist.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{dist.marathiName}</span>
                      </td>
                      <td className="py-3 px-3 text-[11px] max-w-[140px] truncate">
                        {dist.majorDisease}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {dist.activeCases}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dist.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-800' : dist.riskLevel === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {dist.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            onNavigate('hotspots');
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          View GIS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Input Supply Chain & Active Learning Continuous Training */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Agro-Chemical & Bio-Input Buffer Stock Monitor */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    District Input Buffer Stockpile
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Real-Time Inventory</span>
              </div>

              <div className="space-y-2.5">
                {supplyChainStocks.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{item.molecule}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        item.status === 'Warning' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.stockMetric}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Warehouses: {item.district}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Active Learning Pipeline & Model Retraining */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Continuous Learning Pipeline
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-purple-950 font-bold">Unlabeled Queue:</span>
                  <span className="font-mono font-bold text-purple-900">1,240 Verified Maharashtra Samples</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-purple-950 font-bold">Pipeline Status:</span>
                  <span className="font-mono text-emerald-800 font-bold text-[11px]">{retrainingStatus}</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Incorporates newly confirmed field strain variations of Tomato Late Blight and Pink Bollworm to prevent model drift.
                </p>
              </div>

              <button
                onClick={handleTriggerRetrain}
                disabled={isRetraining}
                className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${isRetraining ? 'animate-spin' : ''}`} />
                <span>
                  {isRetraining ? 'Executing Distributed Retraining Job...' : 'Trigger Model Fine-Tuning Pipeline'}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

