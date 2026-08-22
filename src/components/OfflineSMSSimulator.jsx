import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  PhoneCall, 
  X, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Radio,
  MessageSquare
} from 'lucide-react';
import { speakAdvisory, stopSpeech } from '../utils/audioSpeech';

export const OfflineSMSSimulator = ({ isOpen, onClose, currentLang }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('sms'); // 'sms' | 'ivr'
  const [inputQuery, setInputQuery] = useState('PEST TOMATO NASHIK YELLOW SPOTS');
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: 'KrushiRaksha SMS Gateway (Shortcode: 56161). Text CROP <NAME> <DISTRICT> <SYMPTOMS> for instant offline advisory.'
    }
  ]);
  const [isCalling, setIsCalling] = useState(false);
  const [ivrStep, setIvrStep] = useState(1);

  const handleSendSMS = () => {
    if (!inputQuery.trim()) return;

    const userMsg = { sender: 'user', text: inputQuery };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      let reply = '';
      if (inputQuery.toLowerCase().includes('tomato')) {
        reply = 'KRUSHIRAKSHA: Tomato Late Blight suspected in Nashik belt. Immediate action: Apply Copper Oxychloride 50 WP (2.5g/L). Rain expected in 48h. PHI: 3 days. KVK Helpline: 1800-KRUSHI';
      } else if (inputQuery.toLowerCase().includes('cotton')) {
        reply = 'KRUSHIRAKSHA: Pink Bollworm alert in Vidarbha. Install 8 pheromone traps/acre. ETL crossed. Spray Chlorantraniliprole 18.5 SC (0.3ml/L). KVK Helpline: 1800-KRUSHI';
      } else {
        reply = 'KRUSHIRAKSHA: Crop registered. Weather risk in your taluka is Moderate. Maintain prophylactic Neem 10000 ppm spray. Text HELP for KVK agronomist call.';
      }
      setMessages(prev => [...prev, { sender: 'system', text: reply }]);
    }, 600);
  };

  const handleStartIVR = () => {
    setIsCalling(true);
    setIvrStep(1);
    speakAdvisory('कृषीरक्षा टोल-फ्री हेल्पलाइनमध्ये आपले स्वागत आहे. टोमॅटो पिकाच्या सल्ल्यासाठी १ दाबा, कापसासाठी २ दाबा, द्राक्षासाठी ३ दाबा.', 'mr');
  };

  const handleIVRPress = (digit) => {
    if (digit === 1) {
      setIvrStep(2);
      speakAdvisory('टोमॅटो पिकावर करपा रोगाची लक्षणे आढळल्यास कॉपर ऑक्सीक्लोराईड २५ ग्रॅम प्रति १० लिटर पाण्यात फवारावे. तीन दिवसांत पुन्हा शेत तपासावे.', 'mr');
    } else if (digit === 2) {
      setIvrStep(3);
      speakAdvisory('कापूस पिकावर बोंडअळी नियंत्रणासाठी कामगंध सापळे लावावेत आणि कोराजन औषधाची संध्याकाळी फवारणी करावी.', 'mr');
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    stopSpeech();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0F382A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Offline Feature-Phone Gateway</h3>
              <span className="text-[10px] text-emerald-300 font-mono">No Internet / 2G SMS & IVR Simulator</span>
            </div>
          </div>
          <button 
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              stopSpeech();
              setMode('sms');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'sms' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            💬 2-Way SMS Gateway (56161)
          </button>
          <button
            onClick={() => {
              stopSpeech();
              setMode('ivr');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'ivr' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            📞 Voice IVR Bot (1800-KRUSHI)
          </button>
        </div>

        {/* Mode 1: SMS Simulator */}
        {mode === 'sms' && (
          <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto min-h-[350px]">
            <div className="space-y-2.5 flex-1 overflow-y-auto p-1">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed font-mono ${
                    m.sender === 'user' 
                      ? 'bg-[#0F382A] text-white rounded-br-none' 
                      : 'bg-emerald-50 text-slate-900 border border-emerald-200 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick SMS Presets */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Click Sample Farmer SMS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setInputQuery('PEST TOMATO NASHIK BLIGHT')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-mono cursor-pointer"
                >
                  PEST TOMATO NASHIK
                </button>
                <button
                  onClick={() => setInputQuery('PEST COTTON YAVATMAL BOLLWORM')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-mono cursor-pointer"
                >
                  PEST COTTON YAVATMAL
                </button>
              </div>
            </div>

            {/* SMS Input Box */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSMS()}
                placeholder="Type SMS to 56161..."
                className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              <button
                onClick={handleSendSMS}
                className="p-2.5 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl shadow cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: IVR Voice Bot Simulator */}
        {mode === 'ivr' && (
          <div className="p-6 flex-1 flex flex-col items-center justify-center space-y-6 text-center">
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 font-mono">
                TOLL-FREE KISAN HELPLINE
              </span>
              <h4 className="text-xl font-extrabold text-slate-900">
                1800-KRUSHI (1800-578-744)
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Interactive Voice Response in Marathi & Hindi for non-smartphone users.
              </p>
            </div>

            {!isCalling ? (
              <button
                onClick={handleStartIVR}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title="Start IVR Call Simulation"
              >
                <PhoneCall className="w-8 h-8 animate-pulse" />
              </button>
            ) : (
              <div className="space-y-4 w-full">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Call in Progress (मराठी व्हॉइस बोट)</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    {ivrStep === 1 
                      ? 'पिकाचा सल्ला निवडण्यासाठी खालील बटण दाबा:' 
                      : ivrStep === 2 
                        ? 'टोमॅटो करपा सल्ला प्रसारित केला जात आहे...' 
                        : 'कापूस बोंडअळी सल्ला प्रसारित केला जात आहे...'}
                  </p>
                </div>

                {/* Keypad Buttons */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-xs font-bold">
                  <button
                    onClick={() => handleIVRPress(1)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-amber-400 hover:text-emerald-950 transition-colors border border-slate-200"
                  >
                    1 (Tomato)
                  </button>
                  <button
                    onClick={() => handleIVRPress(2)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-amber-400 hover:text-emerald-950 transition-colors border border-slate-200"
                  >
                    2 (Cotton)
                  </button>
                  <button
                    onClick={() => handleIVRPress(3)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-amber-400 hover:text-emerald-950 transition-colors border border-slate-200"
                  >
                    3 (Grapes)
                  </button>
                </div>

                <button
                  onClick={handleEndCall}
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow cursor-pointer transition-colors"
                >
                  End Call (कॉल बंद करा)
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

