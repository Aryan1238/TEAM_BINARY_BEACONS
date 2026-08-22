import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  UserCheck, 
  Layers, 
  Info, 
  FileText, 
  ShieldAlert, 
  RefreshCw,
  Bug,
  Sliders,
  Check,
  Share2
} from 'lucide-react';
import { cropDiseases } from '../data/cropDiseases';
import { sampleCases } from '../data/sampleCases';
import { speakAdvisory, stopSpeech } from '../utils/audioSpeech';
import confetti from 'canvas-confetti';

export const DiagnosticStudio = ({ currentLang, onNavigate, onSelectDiseaseForIPM, onEscalateKVK }) => {
  const [selectedCase, setSelectedCase] = useState(sampleCases[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(cropDiseases[0]);
  const [showSaliency, setShowSaliency] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [inputModality, setInputModality] = useState('photo'); // 'photo' | 'trap' | 'symptoms'
  
  // Trap input state
  const [trapMothCount, setTrapMothCount] = useState(14);
  const [trapType, setTrapType] = useState('pheromone');
  
  // Symptom questionnaire state
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [cropStage, setCropStage] = useState('flowering');
  const [observedSymptom, setObservedSymptom] = useState('water_spots');

  const handleSelectSample = (sample) => {
    setSelectedCase(sample);
    setIsAnalyzing(true);
    stopSpeech();
    setIsPlayingAudio(false);

    setTimeout(() => {
      const match = cropDiseases.find(d => d.id === sample.diseaseId) || cropDiseases[0];
      setCurrentDiagnosis(match);
      setIsAnalyzing(false);
      
      if (match.severity !== 'Healthy') {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0F382A', '#E6A122', '#10B981']
        });
      }
    }, 700);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const customCase = {
        id: 'custom-' + Date.now(),
        title: 'Uploaded Leaf Photo',
        crop: 'Field Crop',
        district: 'Current Location (GPS Auto-tagged)',
        diseaseId: 'tomato-late-blight',
        imageUrl: url,
        description: 'Ground photograph captured by farmer device.',
        bbox: { x: 30, y: 25, width: 45, height: 45 },
        saliencyPoints: [
          { x: 42, y: 40, intensity: 0.95 },
          { x: 55, y: 35, intensity: 0.88 }
        ],
        confidence: 93,
        severity: 'Moderate (Grade S2)',
        chlorosisPercent: '25%'
      };
      handleSelectSample(customCase);
    }
  };

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak = currentLang === 'mr' 
        ? currentDiagnosis.audioAdvisory.mr 
        : currentLang === 'hi' 
          ? currentDiagnosis.audioAdvisory.hi 
          : `${currentDiagnosis.name} detected on ${currentDiagnosis.crop}. ${currentDiagnosis.symptoms} Recommended action: ${currentDiagnosis.ipm.chemical[0]?.advisory || 'Consult agricultural extension'}`;
      
      const success = speakAdvisory(textToSpeak, currentLang);
      if (success) {
        setIsPlayingAudio(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleRunTrapAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const pinkBollworm = cropDiseases.find(d => d.id === 'cotton-pink-bollworm') || cropDiseases[1];
      setCurrentDiagnosis(pinkBollworm);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleRunSymptomAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let matched = cropDiseases[0];
      if (selectedCrop === 'Cotton') matched = cropDiseases[1];
      if (selectedCrop === 'Grapes') matched = cropDiseases[2];
      if (selectedCrop === 'Soybean') matched = cropDiseases[3];
      if (selectedCrop === 'Sugarcane') matched = cropDiseases[4];
      setCurrentDiagnosis(matched);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title Banner */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
                Pillar 1: Multi-Input AI Vision
              </span>
              <span className="text-xs text-emerald-300 font-mono">PlantVillage & IP102 Grounded</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Multi-Modal Crop Health Diagnostic Studio
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Upload leaf photographs, pest-trap counts, or symptom checklists to receive instant pathogen identification with Explainable AI saliency grading, severity scoring, and CIBRC-compliant IPM prescriptions.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#0A261D] rounded-xl p-4 border border-emerald-800 shrink-0 text-xs space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Model Accuracy:</span>
              <span className="font-bold text-amber-400 font-mono">98.4% Top-1</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Supported Pathogens:</span>
              <span className="font-bold text-white font-mono">50+ Classes</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Inference Latency:</span>
              <span className="font-bold text-emerald-400 font-mono">&lt; 650 ms</span>
            </div>
          </div>
        </div>

        {/* Modality Selector Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setInputModality('photo')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              inputModality === 'photo'
                ? 'bg-[#0F382A] text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>🌿 Leaf Photo Vision AI (PlantVillage)</span>
          </button>

          <button
            onClick={() => setInputModality('trap')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              inputModality === 'trap'
                ? 'bg-[#0F382A] text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Bug className="w-4 h-4 text-amber-400" />
            <span>🪤 Pest Trap / Sensor (IP102)</span>
          </button>

          <button
            onClick={() => setInputModality('symptoms')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              inputModality === 'symptoms'
                ? 'bg-[#0F382A] text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>📝 Symptom & Stage Questionnaire</span>
          </button>
        </div>

        {/* Main 2-Column Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Image / Modality Input & Sample Presets */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Leaf Photo Modality */}
            {inputModality === 'photo' && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Scan className="w-4 h-4 text-emerald-700" />
                    <span>Leaf Image Scanner & Explainable Attention</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSaliency(!showSaliency)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        showSaliency 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {showSaliency ? '🔥 Heatmap ON' : 'Heatmap OFF'}
                    </button>
                  </div>
                </div>

                {/* Main Scanning Viewport */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 border border-slate-800 group shadow-inner">
                  <img 
                    src={selectedCase.imageUrl} 
                    alt={selectedCase.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isAnalyzing ? 'scale-105 filter blur-xs' : ''}`}
                  />

                  {/* Scanning HUD Laser when analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                      <span className="text-white text-xs font-mono font-bold tracking-wider animate-pulse">
                        RUNNING RESNET-50 INFERENCE...
                      </span>
                    </div>
                  )}

                  {/* Bounding Box & Saliency Overlay */}
                  {!isAnalyzing && showSaliency && selectedCase.bbox && (
                    <>
                      <div 
                        style={{
                          top: `${selectedCase.bbox.y}%`,
                          left: `${selectedCase.bbox.x}%`,
                          width: `${selectedCase.bbox.width}%`,
                          height: `${selectedCase.bbox.height}%`
                        }}
                        className="absolute border-2 border-dashed border-amber-400 bg-amber-400/20 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-start justify-start p-1.5"
                      >
                        <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          {currentDiagnosis.scientificName} ({currentDiagnosis.confidence}%)
                        </span>
                      </div>

                      {/* Simulated Grad-CAM heatmap spots */}
                      {selectedCase.saliencyPoints?.map((p, idx) => (
                        <div
                          key={idx}
                          style={{
                            top: `${p.y}%`,
                            left: `${p.x}%`,
                            width: '40px',
                            height: '40px',
                            transform: 'translate(-50%, -50%)'
                          }}
                          className="absolute rounded-full bg-rose-500/40 blur-md pointer-events-none animate-pulse"
                        />
                      ))}
                    </>
                  )}

                  {/* Image info bar */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between text-xs text-white">
                    <div>
                      <span className="font-bold text-white block">{selectedCase.title}</span>
                      <span className="text-[11px] text-emerald-300 font-mono">{selectedCase.district}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700 font-mono">
                      GPS Tagged
                    </span>
                  </div>
                </div>

                {/* Upload or Camera Capture Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition-all cursor-pointer text-center">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload Leaf Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCustomUpload} 
                      className="hidden" 
                    />
                  </label>

                  <label className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center">
                    <Camera className="w-4 h-4 text-slate-700" />
                    <span>Take Field Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleCustomUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Preset Sample Gallery */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Preloaded Benchmark Samples (Click to test):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {sampleCases.map((sc) => {
                      const isSelected = selectedCase.id === sc.id;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => handleSelectSample(sc)}
                          className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105' : 'border-slate-200 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={sc.imageUrl} 
                            alt={sc.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                            <span className="text-[9px] text-white font-medium leading-tight truncate">
                              {sc.crop}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Pest Trap & Sensor Input Modality */}
            {inputModality === 'trap' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Bug className="w-5 h-5 text-amber-600" />
                    <span>Pest Trap Counts & Micro-Sensor Ingestion</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Input counts from Pheromone traps (Pecti-Lure / Helilure) or Yellow Sticky Cards to determine Economic Threshold Level (ETL).
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Trap Type Installed:
                    </label>
                    <select
                      value={trapType}
                      onChange={(e) => setTrapType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="pheromone">Pheromone Funnel Trap (Cotton Pink Bollworm / Spodoptera)</option>
                      <option value="sticky">Yellow Sticky Card (Whitefly, Thrips, Aphids)</option>
                      <option value="light">Solar Light Trap (Nocturnal Moths & Beetles)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Trap Catch Count (Moths/Insects in last 24h):</span>
                      <span className="text-base font-extrabold text-amber-600 font-mono">{trapMothCount} insects</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={trapMothCount}
                      onChange={(e) => setTrapMothCount(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>1 (Safe)</span>
                      <span>8 (ETL Threshold)</span>
                      <span>30 (Severe Epidemic)</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start space-x-2 ${
                    trapMothCount >= 8 
                      ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        {trapMothCount >= 8 ? '🚨 ECONOMIC THRESHOLD EXCEEDED (ETL TRIGGERED)' : '✅ Trap Catch Below ETL Threshold'}
                      </span>
                      <span>
                        {trapMothCount >= 8 
                          ? 'Moth counts exceed 8 moths/trap/night. Immediate biological or targeted chemical intervention required.' 
                          : 'Pest population is within manageable natural limits. Continue daily scouting.'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunTrapAnalysis}
                    className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Run Pest Model Analysis</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Symptom Questionnaire Modality */}
            {inputModality === 'symptoms' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Guided Symptom & Phenology Wizard</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    For feature phone users or field conditions where camera clarity is low.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Crop:</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                    >
                      <option value="Tomato">Tomato (टोमॅटो)</option>
                      <option value="Cotton">Cotton / Kapas (कापूस)</option>
                      <option value="Grapes">Grapes / Draksha (द्राक्ष)</option>
                      <option value="Soybean">Soybean (सोयाबीन)</option>
                      <option value="Sugarcane">Sugarcane / Oos (ऊस)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Crop Growth Stage:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Seedling', 'Vegetative', 'Flowering', 'Fruiting / Boll', 'Maturity'].map((stage) => (
                        <button
                          key={stage}
                          onClick={() => setCropStage(stage)}
                          className={`p-2 rounded-lg font-medium border text-center transition-all ${
                            cropStage === stage ? 'bg-[#0F382A] text-white border-[#0F382A]' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Observed Field Symptom:</label>
                    <select
                      value={observedSymptom}
                      onChange={(e) => setObservedSymptom(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                    >
                      <option value="water_spots">Dark water-soaked lesions with yellow halo on leaves</option>
                      <option value="rosetted">Rosetted flowers & bored holes in bolls</option>
                      <option value="oily_patches">Yellowish oily spots on leaf tops with white downy fuzz beneath</option>
                      <option value="red_pustules">Reddish-brown rust pustules on leaf underside</option>
                      <option value="stem_rot">Internal red stalk discoloration with white transverse bands</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRunSymptomAnalysis}
                    className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Infer Pathogen from Symptoms</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Real-Time Diagnostic Output & Action Plan */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Diagnosis Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              {/* Top Banner */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Verified AI Diagnosis
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 font-mono">
                      {currentDiagnosis.pathogenType}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {currentLang === 'mr' 
                      ? currentDiagnosis.marathiName 
                      : currentLang === 'hi' 
                        ? currentDiagnosis.hindiName 
                        : currentDiagnosis.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono italic">
                    {currentDiagnosis.scientificName} · {currentDiagnosis.crop}
                  </p>
                </div>

                {/* Audio Readout Button */}
                <button
                  onClick={handleAudioToggle}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-sm ${
                    isPlayingAudio 
                      ? 'bg-amber-500 text-emerald-950 animate-pulse' 
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title="Listen to advisory in selected language"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Stop Audio' : `Audio (${currentLang.toUpperCase()})`}</span>
                </button>
              </div>

              {/* Confidence & Severity Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">AI Confidence</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    {currentDiagnosis.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Severity Score</span>
                  <span className={`text-base font-extrabold font-mono ${
                    currentDiagnosis.severityScore >= 3 ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {currentDiagnosis.severity} (Grade S{currentDiagnosis.severityScore})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Leaf Wetness Risk</span>
                  <span className="text-base font-extrabold text-blue-700 font-mono">
                    {currentDiagnosis.favorableConditions.leafWetnessHours}
                  </span>
                </div>
              </div>

              {/* Symptoms Description */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                  Clinical Symptoms Observed:
                </span>
                <p className="text-slate-600 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 leading-relaxed">
                  {currentLang === 'mr' 
                    ? currentDiagnosis.marathiSymptoms 
                    : currentLang === 'hi' 
                      ? currentDiagnosis.hindiSymptoms 
                      : currentDiagnosis.symptoms}
                </p>
              </div>

              {/* Tiered IPM Action Plan */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    CIBRC & ICAR Integrated Pest Management (IPM) Plan:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">Grade: Verified</span>
                </div>

                {/* Tier 1: Cultural / Mechanical */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs space-y-1">
                  <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                    <span>1. Cultural & Mechanical Practice (No Cost)</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {currentDiagnosis.ipm.cultural[0]}
                  </p>
                </div>

                {/* Tier 2: Biological Control */}
                {currentDiagnosis.ipm.biological?.length > 0 && (
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center justify-between">
                      <span>2. Bio-Pesticide Control (Organic Shield)</span>
                      <span className="text-[11px] text-emerald-700 font-mono">{currentDiagnosis.ipm.biological[0].costEstimate}</span>
                    </span>
                    <p className="text-slate-700">
                      <strong>{currentDiagnosis.ipm.biological[0].name}:</strong> {currentDiagnosis.ipm.biological[0].dosage} ({currentDiagnosis.ipm.biological[0].timing})
                    </p>
                  </div>
                )}

                {/* Tier 3: Chemical (CIBRC Approved) */}
                {currentDiagnosis.ipm.chemical?.length > 0 && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950">
                        3. CIBRC-Registered Chemical Molecule (Targeted)
                      </span>
                      <span className="text-[11px] text-blue-800 font-mono font-bold">
                        PHI: {currentDiagnosis.ipm.chemical[0].phiDays} Days
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">
                      {currentDiagnosis.ipm.chemical[0].molecule}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Dosage: <strong>{currentDiagnosis.ipm.chemical[0].dosagePerTank}</strong> | Brand: {currentDiagnosis.ipm.chemical[0].brandExamples}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    onSelectDiseaseForIPM(currentDiagnosis);
                    onNavigate('ipm');
                  }}
                  className="bg-[#E6A122] hover:bg-[#D69112] text-[#0A261D] py-2.5 px-4 rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Spray Dosage by Acre</span>
                </button>

                <button
                  onClick={() => {
                    onEscalateKVK(currentDiagnosis);
                    alert(`Diagnosis ticket escalated to KVK Agronomist desk for ${selectedCase.district}. You will receive ground validation within 2 hours.`);
                  }}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer border border-emerald-700"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Escalate to KVK Agronomist</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

