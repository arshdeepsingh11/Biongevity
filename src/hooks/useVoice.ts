"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal typing for the browser Web Speech API (Chrome, Edge, Safari). */
interface SpeechResult { 0: { transcript: string }; isFinal: boolean }
interface SpeechEvent { resultIndex: number; results: ArrayLike<SpeechResult> }
interface Recognition { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; abort(): void;
  onresult: ((e: SpeechEvent) => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null }
type RecognitionCtor = new () => Recognition;

/**
 * Voice ask — speech-to-text using the browser's built-in recogniser (no extra service, no cost).
 * `onText(text, final)` streams what was heard; when speech ends, the final text is delivered.
 */
export function useVoice(onText: (text: string, final: boolean) => void, lang?: string) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const rec = useRef<Recognition | null>(null);
  const cb = useRef(onText);
  cb.current = onText;
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    setSupported(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
    return () => rec.current?.abort();
  }, []);

  const start = useCallback(() => {
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!C) return;
    const r = new C();
    r.lang = navigator.language || "en-CA"; r.interimResults = true; r.continuous = false;
    let text = "";
    r.onresult = (e) => {
      text = Array.from(e.results).map((x) => x[0].transcript).join("");
      cb.current(text, false);
    };
    r.onend = () => { setListening(false); if (text.trim()) cb.current(text.trim(), true); };
    r.onerror = () => setListening(false);
    rec.current = r; r.start(); setListening(true);
  }, []);

  const stop = useCallback(() => rec.current?.stop(), []);
  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);
  return { supported, listening, toggle, stop };
}
