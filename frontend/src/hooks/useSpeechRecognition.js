import { useEffect, useRef, useState } from 'react';

export default function useSpeechRecognition({ onResult, lang = 'en-US', interim = true } = {}) {
  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [supported, setSupported] = useState(!!SpeechRecognition);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = lang;
    r.interimResults = interim;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      try {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        onResult && onResult(transcript.trim());
      } catch (_) {}
    };
    r.onerror = (e) => {
      setError(e?.error || 'speech-error');
      setListening(false);
    };
    r.onend = () => setListening(false);
    recRef.current = r;
    return () => {
      try { r.abort(); } catch (_) {}
      recRef.current = null;
    };
  }, [SpeechRecognition, onResult, lang, interim]);

  const start = () => {
    if (!recRef.current) return;
    setError(null);
    try {
      recRef.current.start();
      setListening(true);
    } catch (_) { /* already started */ }
  };

  const stop = () => {
    if (!recRef.current) return;
    try { recRef.current.stop(); } catch (_) {}
    setListening(false);
  };

  return { supported, listening, start, stop, error };
}

