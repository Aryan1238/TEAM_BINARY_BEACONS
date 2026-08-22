import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  Droplets, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  FileText, 
  Printer, 
  Leaf, 
  ShieldAlert, 
  Sliders,
  Check
} from 'lucide-react';
import { cropDiseases } from '../data/cropDiseases';

export const IPMCalculator = ({ currentLang, selectedDisease, onSelectDisease }) => {
  const [activeDiseaseId, setActiveDiseaseId] = useState(selectedDisease?.id || cropDiseases[0].id);
  const disease = cropDiseases.find(d => d.id === activeDiseaseId) || cropDiseases[0];

  const [farmAcres, setFarmAcres] = useState(2.5);
  const [tankSizeLiters, setTankSizeLiters] = useState(15);
  const [selectedChemicalIdx, setSelectedChemicalIdx] = useState(0);

  const selectedChemical = disease.ipm.chemical?.[selectedChemicalIdx] || disease.ipm.chemical?.[0];

  // Mathematical spray calculations
  const waterLitersPerAcre = 200; // Standard ICAR knapsack water volume
  const totalWaterLiters = Math.round(farmAcres * waterLitersPerAcre);
  const totalTankLoads = (totalWaterLiters / tankSizeLiters).toFixed(1);

  // Extract numerical dosage per liter (approximate regex parser)
  const dosagePerLiterRaw = parseFloat(selectedChemical?.dosagePerLiter) || 2.0;
  const isLiquid = selectedChemical?.dosagePerLiter?.includes('ml');
  const unit = isLiquid ? 'ml' : 'g';

  const totalChemicalRequired = (totalWaterLiters * dosagePerLiterRaw).toFixed(1);
  const chemicalPerTank = (tankSizeLiters * dosagePerLiterRaw).toFixed(1);

  // Estimated Cost calculation (approx ₹ 400 - 900 / acre)
  const costNumber = parseInt(selectedChemical?.costEstimate?.replace(/[^0-9]/g, '')) || 500;
  const totalEstimatedCost = Math.round(farmAcres * costNumber);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-400 text-purple-950">
                Pillar 4: Integrated Pest Management
              </span>
              <span className="text-xs text-emerald-300 font-mono">CIBRC & ICAR Package of Practices</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CIBRC Regimen & Precision Spray Dosage Engine
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Automated acreage-to-knapsack tank dilution calculator, Pre-Harvest Interval (PHI) compliance tracker, and chemical safety matrix.
            </p>
          </div>

          {/* Disease Selector Dropdown in Banner */}
          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 space-y-2 min-w-[280px]">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
              Active Disease Prescription:
            </span>
            <select
              value={activeDiseaseId}
              onChange={(e) => setActiveDiseaseId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              {cropDiseases.filter(d => d.severity !== 'Healthy').map(d => (
                <option key={d.id} value={d.id} className="bg-[#0F382A] text-white">
                  {d.crop}: {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Precision Dosage Calculation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: Interactive Farm Calculator */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  Field Area & Spray Tank Configuration
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                ICAR CALIBRATED
              </span>
            </div>

            {/* Input 1: Farm Acreage Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Total Farm Area to Spray:</span>
                <span className="text-base font-extrabold text-emerald-800 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {farmAcres} Acres ({(farmAcres * 40).toFixed(0)} Gunthas)
                </span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="10" 
                step="0.5" 
                value={farmAcres}
                onChange={(e) => setFarmAcres(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.5 Acre</span>
                <span>2.5 Acres (Avg MH Smallholder)</span>
                <span>10.0 Acres</span>
              </div>
            </div>

            {/* Input 2: Knapsack Tank Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Sprayer Pump Type / Tank Capacity:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { size: 15, label: '15L Standard Knapsack' },
                  { size: 20, label: '20L Battery Sprayer' },
                  { size: 200, label: '200L Tractor Boom Tank' }
                ].map(item => (
                  <button
                    key={item.size}
                    onClick={() => setTankSizeLiters(item.size)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      tankSizeLiters === item.size
                        ? 'bg-[#0F382A] text-white border-[#0F382A] shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>{item.size} Liters</div>
                    <span className="text-[10px] font-normal opacity-80 block">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Molecule Choice */}
            {disease.ipm.chemical?.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select CIBRC Approved Chemical Formulation:
                </label>
                <div className="space-y-2">
                  {disease.ipm.chemical.map((chem, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChemicalIdx(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedChemicalIdx === idx
                          ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300/40'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{chem.molecule}</span>
                        <span className="text-[10px] text-blue-700 font-mono">PHI: {chem.phiDays} Days</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">Brand: {chem.brandExamples}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculation Result Summary Box */}
            <div className="bg-[#0F382A] text-white rounded-2xl p-5 space-y-4 shadow-lg border border-emerald-800">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Calculated Spray Recipe Card
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {farmAcres} Acres Coverage
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#0A261D] rounded-xl border border-emerald-900">
                  <span className="text-[11px] text-emerald-300 block">Total Water Required</span>
                  <span className="text-xl font-extrabold text-white font-mono">{totalWaterLiters} Liters</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">~{totalTankLoads} pump loads</span>
                </div>

                <div className="p-3 bg-[#0A261D] rounded-xl border border-emerald-900">
                  <span className="text-[11px] text-amber-300 block">Total Chemical Required</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono">
                    {totalChemicalRequired} {unit}
                  </span>
                  <span className="text-[10px] text-emerald-300 block mt-0.5">for entire {farmAcres} acres</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-900/60 rounded-xl border border-emerald-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-200">Per Knapsack Tank Formulation:</span>
                  <span className="font-extrabold text-amber-300 font-mono text-sm">
                    {chemicalPerTank} {unit} / {tankSizeLiters}L Tank
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80">
                  Add clean water first to 50% tank capacity, dissolve {chemicalPerTank} {unit} thoroughly, then top up to {tankSizeLiters}L.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-emerald-200 font-medium">
                <span>Estimated Input Expenditure:</span>
                <span className="font-bold text-white text-sm font-mono">₹ {totalEstimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: CIBRC Food Safety, PHI & Mixing Compatibility */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Food Safety & Pre-Harvest Interval (PHI) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Food Safety & Pre-Harvest Interval (PHI)
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 font-mono">
                  {selectedChemical?.phiDays || 3} DAYS PHI
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Pre-Harvest Interval (PHI):</strong> You must wait at least <strong>{selectedChemical?.phiDays || 3} days</strong> after spraying before harvesting crops for market consumption to ensure pesticide residue falls below statutory FSSAI / export Maximum Residue Limits (MRL).
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Harvesting Safety Countdown</span>
                </span>
                <p className="text-amber-800 text-[11px]">
                  If you spray today ({new Date().toLocaleDateString('en-IN')}), earliest safe harvest date is <strong>{new Date(Date.now() + (selectedChemical?.phiDays || 3)*86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</strong>.
                </p>
              </div>
            </div>

            {/* 2. Chemical Mixing Compatibility & Hazard Matrix */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Chemical Tank Mixing & Compatibility Matrix
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                  <span className="font-bold block">❌ DO NOT MIX WITH (Antagonistic Combinations):</span>
                  <p className="text-[11px] leading-relaxed">
                    Do not mix Copper fungicides with <em>Trichoderma</em> (Copper kills biological beneficial fungi). Avoid tank-mixing alkaline chemicals with organophosphates.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-bold block">✅ COMPATIBLE WITH:</span>
                  <p className="text-[11px] leading-relaxed">
                    Most neutral pH spreader-stickers (Agral 90 / Wetcit @ 0.5ml/L) to enhance leaf canopy adhesion during monsoon conditions.
                  </p>
                </div>
              </div>

              {/* Mandatory PPE Checklist */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Mandatory PPE Checklist for Spray Operators:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>N95 Face Mask / Respirator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Nitrile Chemical Gloves</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Safety Eye Goggles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Spray in windward direction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Recipe Button */}
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Spray Card for Field Operator</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

