import { useCallback, useMemo, useRef, useState } from 'react';

export default function useSpeechSynthesis({ lang = 'en-US', rate = 1, pitch = 1 } = {}) {
  const supported = useMemo(() => (typeof window !== 'undefined' && 'speechSynthesis' in window), []);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const cancel = useCallback(() => {
    if (!supported) return;
    try { window.speechSynthesis.cancel(); } catch (_) {}
    setSpeaking(false);
    utteranceRef.current = null;
  }, [supported]);

  const speak = useCallback((text) => {
    if (!supported || !text) return;
    cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => { setSpeaking(false); utteranceRef.current = null; };
    u.onerror = () => { setSpeaking(false); utteranceRef.current = null; };
    utteranceRef.current = u;
    setSpeaking(true);
    try { window.speechSynthesis.speak(u); } catch (_) { setSpeaking(false); }
  }, [supported, lang, rate, pitch, cancel]);

  return { supported, speaking, speak, cancel };
}

