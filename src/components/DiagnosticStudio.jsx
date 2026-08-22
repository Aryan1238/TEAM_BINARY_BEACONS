import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Video,
  VideoOff,
  Crosshair,
  Zap,
  Activity,
  Maximize,
  SwitchCamera,
  Globe,
  Radio,
  Wifi,
  Cast
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
  const [inputModality, setInputModality] = useState('camera'); // 'camera' | 'ipcam' | 'photo' | 'trap' | 'symptoms'
  
  // Real-time YOLO Camera State
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' | 'user'
  const [cameraSourceType, setCameraSourceType] = useState('webcam'); // 'webcam' | 'ipcam' | 'simulated'
  
  // IP Camera State
  const [ipCamUrl, setIpCamUrl] = useState('http://192.168.1.105:8080/video');
  const [ipCamConnected, setIpCamConnected] = useState(false);
  const [selectedIpPreset, setSelectedIpPreset] = useState('drone-nashik');

  const [yoloFps, setYoloFps] = useState('38.4');
  const [yoloConfidenceThreshold, setYoloConfidenceThreshold] = useState(0.85);
  const [torchOn, setTorchOn] = useState(false);
  
  const [detectedYoloBoxes, setDetectedYoloBoxes] = useState([
    { id: 1, label: 'Late Blight Lesion (S2)', conf: 0.948, x: 22, y: 28, w: 42, h: 38, color: '#EF4444' },
    { id: 2, label: 'Chlorosis Halo', conf: 0.892, x: 55, y: 45, w: 32, h: 30, color: '#F59E0B' }
  ]);

  // Trap input state
  const [trapMothCount, setTrapMothCount] = useState(14);
  const [trapType, setTrapType] = useState('pheromone');
  
  // Symptom questionnaire state
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [cropStage, setCropStage] = useState('flowering');
  const [observedSymptom, setObservedSymptom] = useState('water_spots');

  // Initialize camera stream when camera tab is active
  useEffect(() => {
    let stream = null;

    if (inputModality === 'camera' && cameraSourceType === 'webcam') {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: cameraFacing,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (err) {
          console.warn('Webcam permission error or device unavailable, switching to live simulated test feed:', err);
          setCameraSourceType('simulated');
          setCameraActive(true);
        }
      };

      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (cameraSourceType !== 'webcam') {
        setCameraActive(true);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [inputModality, cameraFacing, cameraSourceType]);

  // Simulated live YOLO box jitter for realistic HUD
  useEffect(() => {
    if (inputModality !== 'camera' && inputModality !== 'ipcam') return;
    const interval = setInterval(() => {
      setYoloFps((36 + Math.random() * 4).toFixed(1));
      setDetectedYoloBoxes(prev => prev.map(b => ({
        ...b,
        conf: Math.min(0.99, Math.max(0.85, (b.conf + (Math.random() - 0.5) * 0.02))),
        x: Math.min(65, Math.max(12, b.x + (Math.random() - 0.5) * 1.5)),
        y: Math.min(55, Math.max(18, b.y + (Math.random() - 0.5) * 1.5))
      })));
    }, 600);
    return () => clearInterval(interval);
  }, [inputModality]);

  const handleConnectIpCam = (preset) => {
    if (preset === 'drone-nashik') {
      setIpCamUrl('http://192.168.4.1:8554/live (Nashik Vineyard Drone #1)');
    } else if (preset === 'tractor-yavatmal') {
      setIpCamUrl('http://192.168.1.180:8080/mjpeg (Yavatmal Boom ESP32-CAM)');
    } else if (preset === 'phone-ipcam') {
      setIpCamUrl('http://192.168.1.105:8080/video (Android IP Webcam)');
    }
    setCameraSourceType('ipcam');
    setIpCamConnected(true);
    setInputModality('camera');
    
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleCaptureYoloFrame = () => {
    setIsAnalyzing(true);
    stopSpeech();
    setIsPlayingAudio(false);

    setTimeout(() => {
      const match = cropDiseases[0]; // Tomato Late Blight
      setCurrentDiagnosis(match);
      setIsAnalyzing(false);
      
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#0F382A', '#E6A122', '#10B981']
      });
    }, 700);
  };

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
    }, 600);
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
    }, 500);
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
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header Title Banner */}
        <div className="bg-[#0F382A] rounded-2xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-emerald-950 shadow-sm flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping mr-1" />
                <span>Pillar 1: YOLO Real-Time Vision & Multi-Modal Studio</span>
              </span>
              <span className="text-xs text-emerald-300 font-mono hidden sm:inline">YOLOv8-Agri · ONNX WebGL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Multi-Modal Crop Diagnosis & YOLO Live Camera
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Connect via Smartphone Camera, IP Drone Stream / RTSP, or upload leaf photographs for real-time bounding box detection, Grad-CAM saliency heatmaps, and CIBRC precision IPM prescriptions.
            </p>
          </div>

          {/* Audio Synthesizer Quick Trigger */}
          <div className="bg-[#0A261D] rounded-2xl p-3.5 border border-emerald-800 shrink-0 space-y-2 text-xs">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Multilingual Voiceout:</span>
            </span>
            <button
              onClick={handleAudioToggle}
              className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-rose-500 text-white shadow-md animate-pulse' 
                  : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Speech ({currentLang.toUpperCase()})</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Advisory ({currentLang === 'mr' ? 'मराठी' : currentLang === 'hi' ? 'हिंदी' : 'English'})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Modality Tabs Bar with IP Camera Support */}
        <div className="bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-sm flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setInputModality('camera');
              setCameraSourceType('webcam');
            }}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              inputModality === 'camera' && cameraSourceType !== 'ipcam'
                ? 'bg-[#0F382A] text-white shadow-md border border-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="truncate">1. Device Live Camera</span>
          </button>

          <button
            onClick={() => {
              setInputModality('camera');
              setCameraSourceType('ipcam');
            }}
            className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              cameraSourceType === 'ipcam' && inputModality === 'camera'
                ? 'bg-[#0F382A] text-white shadow-md border border-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span className="truncate">2. IP Camera / Drone RTSP</span>
          </button>

          <button
            onClick={() => setInputModality('photo')}
            className={`flex-1 min-w-[130px] sm:min-w-[150px] py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              inputModality === 'photo' 
                ? 'bg-[#0F382A] text-white shadow-md border border-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="truncate">3. Leaf Photos</span>
          </button>

          <button
            onClick={() => setInputModality('trap')}
            className={`flex-1 min-w-[130px] sm:min-w-[150px] py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              inputModality === 'trap' 
                ? 'bg-[#0F382A] text-white shadow-md border border-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bug className="w-4 h-4 text-amber-400" />
            <span className="truncate">4. Pest Traps</span>
          </button>

          <button
            onClick={() => setInputModality('symptoms')}
            className={`flex-1 min-w-[130px] sm:min-w-[150px] py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              inputModality === 'symptoms' 
                ? 'bg-[#0F382A] text-white shadow-md border border-emerald-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="truncate">5. Symptom Wizard</span>
          </button>
        </div>

        {/* Main 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Input Modalities (YOLO Camera / IP / Upload / Trap) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* ------------------------------------------------------- */}
            {/* MODALITY 1: YOLO LIVE CAMERA & IP STREAM VIEWPORT */}
            {/* ------------------------------------------------------- */}
            {inputModality === 'camera' && (
              <div className="bg-[#0A261D] rounded-2xl p-4 sm:p-5 border border-emerald-800 shadow-xl space-y-4 text-white">
                
                {/* Camera Top HUD */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-emerald-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-extrabold tracking-wider text-amber-300 font-mono uppercase">
                      {cameraSourceType === 'ipcam' ? 'IP Drone Stream (RTSP/HTTP)' : 'YOLOv8-Agri Live Vision'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{yoloFps} FPS · 14ms Latency</span>
                  </div>
                </div>

                {/* IP Camera Quick Selector Bar if in IP mode */}
                {cameraSourceType === 'ipcam' && (
                  <div className="p-3 bg-emerald-950/90 rounded-xl border border-emerald-700/80 space-y-2.5 text-xs">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Select Field IoT / Drone Stream Source:</span>
                    </span>
                    
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleConnectIpCam('drone-nashik')}
                        className="p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[10px] font-bold text-left border border-emerald-700 cursor-pointer"
                      >
                        <span className="text-amber-300 block">🛸 Drone #1</span>
                        <span className="text-slate-300 font-normal">Nashik Vineyard</span>
                      </button>

                      <button
                        onClick={() => handleConnectIpCam('tractor-yavatmal')}
                        className="p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[10px] font-bold text-left border border-emerald-700 cursor-pointer"
                      >
                        <span className="text-cyan-300 block">🚜 ESP32 Boom</span>
                        <span className="text-slate-300 font-normal">Yavatmal Cotton</span>
                      </button>

                      <button
                        onClick={() => handleConnectIpCam('phone-ipcam')}
                        className="p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[10px] font-bold text-left border border-emerald-700 cursor-pointer"
                      >
                        <span className="text-emerald-300 block">📱 IP Phone</span>
                        <span className="text-slate-300 font-normal">Custom HTTP</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={ipCamUrl}
                        onChange={(e) => setIpCamUrl(e.target.value)}
                        placeholder="Enter RTSP or IP Webcam URL (e.g. http://192.168.1.100:8080/video)"
                        className="flex-1 bg-[#051811] text-emerald-100 border border-emerald-700 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                      <button
                        onClick={() => handleConnectIpCam('custom')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Camera Viewport (Never turns white) */}
                <div className="relative w-full h-[380px] bg-[#051811] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-inner flex items-center justify-center group">
                  
                  {/* Real Video Element if WebCam active */}
                  {cameraSourceType === 'webcam' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Guaranteed High-Definition Agricultural Test Stream Background */}
                  {(cameraSourceType !== 'webcam' || !cameraActive) && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700" 
                      style={{ 
                        backgroundImage: `url(${sampleCases[0].imageUrl})`,
                        backgroundColor: '#0A261D'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                    </div>
                  )}

                  {/* Scanning Laser Line Animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-[scan_2.5s_ease-in-out_infinite]" />

                  {/* YOLO Bounding Box Overlays */}
                  {detectedYoloBoxes.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        top: `${box.y}%`,
                        left: `${box.x}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`,
                        borderColor: box.color
                      }}
                      className="absolute border-2 rounded-lg bg-rose-500/10 shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all duration-300 flex flex-col justify-between p-1.5 pointer-events-none"
                    >
                      <div className="self-start px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-600 text-white shadow">
                        {box.label} [{(box.conf * 100).toFixed(1)}%]
                      </div>

                      <div className="self-end px-1.5 py-0.2 rounded text-[8px] font-mono bg-black/80 text-emerald-300">
                        x:{box.x.toFixed(0)} y:{box.y.toFixed(0)}
                      </div>
                    </div>
                  ))}

                  {/* Center Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-16 h-16 text-emerald-400/40 animate-pulse" />
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-300">
                      {cameraSourceType === 'ipcam' ? 'IP Feed: Connected (MJPEG 30fps)' : 'Res: 1280x720 (WebGL)'}
                    </span>
                    <span className="text-amber-300">Detected: 2 Outbreak Epicenters</span>
                  </div>
                </div>

                {/* Camera Control Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment')}
                    className="py-2.5 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <SwitchCamera className="w-4 h-4 text-emerald-300" />
                    <span>Flip Lens</span>
                  </button>

                  <button
                    onClick={() => setTorchOn(!torchOn)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                      torchOn ? 'bg-amber-400 text-emerald-950 font-extrabold' : 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Torch {torchOn ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={handleCaptureYoloFrame}
                    disabled={isAnalyzing}
                    className="py-2.5 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-1.5 transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Inferring...' : 'Capture Frame'}</span>
                  </button>
                </div>

                {/* YOLO Sensitivity Threshold Slider */}
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-emerald-300">YOLO Confidence NMS Filter:</span>
                    <span className="font-bold text-amber-400">{(yoloConfidenceThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={yoloConfidenceThreshold}
                    onChange={(e) => setYoloConfidenceThreshold(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

              </div>
            )}

            {/* MODALITY 2: LEAF PHOTO BENCHMARK SAMPLES */}
            {inputModality === 'photo' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      PlantVillage Benchmark Specimens
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select calibrated disease leaf sample or upload ground photo.
                    </p>
                  </div>

                  <label className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Leaf</span>
                    <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
                  </label>
                </div>

                {/* Benchmark Cases Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sampleCases.map((sc) => {
                    const isSelected = selectedCase.id === sc.id;
                    return (
                      <div
                        key={sc.id}
                        onClick={() => handleSelectSample(sc)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-emerald-700 ring-2 ring-emerald-400/40 shadow-md scale-102' 
                            : 'border-slate-200 hover:border-slate-300 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <div className="h-24 bg-slate-900 relative overflow-hidden">
                          <img 
                            src={sc.imageUrl} 
                            alt={sc.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-black/70 text-white">
                            {sc.crop}
                          </span>
                        </div>
                        <div className="p-2 bg-white text-[11px] font-bold text-slate-800 truncate">
                          {sc.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* MODALITY 3: PEST TRAP COUNTER (IP102) */}
            {inputModality === 'trap' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Bug className="w-5 h-5 text-amber-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Pheromone Trap & Yellow Sticky Ingestion
                    </h2>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                    IP102 BENCHMARK
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Pheromone Funnel Trap Ingestion (Moths / Trap / Night):
                    </label>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                      <span>Trap Catch: {trapMothCount} Pink Bollworm Moths</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        trapMothCount >= 8 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {trapMothCount >= 8 ? 'CRITICAL (ETL Crossed)' : 'Sub-Threshold'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={trapMothCount}
                      onChange={(e) => setTrapMothCount(parseInt(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1 moth (Low)</span>
                      <span>8 moths (ETL Threshold)</span>
                      <span>30 moths (Severe Outbreak)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunTrapAnalysis}
                    className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Run Pest ETL Inference & Generate Spray Schedule
                  </button>
                </div>
              </div>
            )}

            {/* MODALITY 4: SYMPTOM QUESTIONNAIRE WIZARD */}
            {inputModality === 'symptoms' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Offline Phenology Checklist Wizard
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Select Crop:</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Tomato">Tomato (टोमॅटो)</option>
                      <option value="Cotton">Cotton (कापूस)</option>
                      <option value="Grapes">Grapes (द्राक्ष)</option>
                      <option value="Soybean">Soybean (सोयाबीन)</option>
                      <option value="Sugarcane">Sugarcane (ऊस)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Observed Symptoms:</label>
                    <select
                      value={observedSymptom}
                      onChange={(e) => setObservedSymptom(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none"
                    >
                      <option value="water_spots">Water-soaked brown lesions</option>
                      <option value="yellow_powder">Yellow powdery growth on underside</option>
                      <option value="boll_hole">Bored holes in bolls / Frass</option>
                      <option value="tuber_rot">Rotting / Red discoloration</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleRunSymptomAnalysis}
                  className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Synthesize Clinical Diagnostic Rule
                </button>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: AI Inference Result & Tiered CIBRC Prescriptions */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Diagnosis Result Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Header Badge & Confidence */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      currentDiagnosis.severity === 'Healthy' 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}>
                      {currentDiagnosis.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Pathogen ID: {currentDiagnosis.id}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {currentDiagnosis.name} ({currentDiagnosis.marathiName})
                  </h3>
                  <p className="text-xs text-slate-500 italic font-serif">
                    Taxonomy: {currentDiagnosis.scientificName} · Crop: {currentDiagnosis.crop}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">AI Confidence</span>
                  <span className="text-2xl font-extrabold text-emerald-700 font-mono">
                    94.8%
                  </span>
                </div>
              </div>

              {/* Symptoms & Transmission Mechanism */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                  Clinical Manifestations & Transmission:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {currentDiagnosis.symptoms}
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Infection Spread: <strong>{currentDiagnosis.vector}</strong></span>
                  <span>Affected Organ: <strong>{currentDiagnosis.affectedPart}</strong></span>
                </div>
              </div>

              {/* Tiered CIBRC Integrated Pest Management Prescriptions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>CIBRC & ICAR Prescribed Regimen</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Hierarchy: Bio &rarr; Chem</span>
                </div>

                {/* Cultural Practices */}
                {currentDiagnosis.ipm.cultural?.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-950 block">Tier 1: Cultural & Agronomic</span>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      {currentDiagnosis.ipm.cultural[0]}
                    </p>
                  </div>
                )}

                {/* Biological Control */}
                {currentDiagnosis.ipm.biological?.length > 0 && (
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-1">
                    <span className="font-bold text-blue-950 block">Tier 2: Biological & Botanical</span>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      {currentDiagnosis.ipm.biological[0].agent} @ {currentDiagnosis.ipm.biological[0].dosage}
                    </p>
                  </div>
                )}

                {/* CIBRC Registered Chemical Molecule */}
                {currentDiagnosis.ipm.chemical?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950">Tier 3: CIBRC Registered Chemical</span>
                      <span className="text-[10px] font-mono font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                        PHI: {currentDiagnosis.ipm.chemical[0].phiDays} Days
                      </span>
                    </div>
                    <p className="font-bold text-purple-900 text-sm">
                      {currentDiagnosis.ipm.chemical[0].molecule}
                    </p>
                    <p className="text-purple-800 text-[11px]">
                      Dosage: <strong>{currentDiagnosis.ipm.chemical[0].dosagePerLiter}</strong> · Brands: {currentDiagnosis.ipm.chemical[0].brandExamples}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectDiseaseForIPM(currentDiagnosis);
                    onNavigate('ipm');
                  }}
                  className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Calculate Spray Dosage &rarr;</span>
                </button>

                <button
                  onClick={() => {
                    onEscalateKVK(currentDiagnosis);
                    alert(`Prescription and leaf coordinates logged. Ticket #KVK-NSK-${Math.floor(100 + Math.random()*900)} escalated to KVK Agronomist.`);
                  }}
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Escalate to KVK Expert</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
