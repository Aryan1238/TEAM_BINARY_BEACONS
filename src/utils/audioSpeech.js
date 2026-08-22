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

  if (lang === 'mr') {
    matchedVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('marathi'));
    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('hindi') || v.lang.includes('IN'));
    }
    utterance.lang = matchedVoice ? matchedVoice.lang : 'hi-IN';
  } else if (lang === 'hi') {
    matchedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('hindi'));
    utterance.lang = matchedVoice ? matchedVoice.lang : 'hi-IN';
  } else {
    matchedVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
    utterance.lang = matchedVoice ? matchedVoice.lang : 'en-US';
  }

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