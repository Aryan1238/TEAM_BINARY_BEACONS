export const speakAdvisory = (text, lang = 'mr') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device');
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  let matchedVoice = null;

  const langMap = {
    mr: ['mr', 'marathi', 'mr-IN'],
    hi: ['hi', 'hindi', 'hi-IN'],
    pa: ['pa', 'punjabi', 'pa-IN'],
    kn: ['kn', 'kannada', 'kn-IN'],
    te: ['te', 'telugu', 'te-IN'],
    ta: ['ta', 'tamil', 'ta-IN'],
    bn: ['bn', 'bengali', 'bn-IN'],
    gu: ['gu', 'gujarati', 'gu-IN'],
    ml: ['ml', 'malayalam', 'ml-IN'],
    or: ['or', 'odia', 'or-IN', 'oriya'],
    en: ['en-IN', 'en-GB', 'en-US', 'en']
  };

  const searchCodes = langMap[lang] || ['hi-IN', 'en-IN'];

  for (const code of searchCodes) {
    matchedVoice = voices.find(v => v.lang.toLowerCase().includes(code.toLowerCase()) || v.name.toLowerCase().includes(code.toLowerCase()));
    if (matchedVoice) break;
  }

  // Fallback to Indian English or Hindi voice if regional synthesizer is unavailable on device
  if (!matchedVoice) {
    matchedVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi') || v.lang.includes('en'));
  }

  utterance.lang = matchedVoice ? matchedVoice.lang : (lang === 'en' ? 'en-US' : 'hi-IN');
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
