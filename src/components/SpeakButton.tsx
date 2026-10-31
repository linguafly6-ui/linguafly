'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, Pause, Loader2, AlertCircle } from 'lucide-react';
import { stripBilingualMarkersForSpeech } from '@/lib/utils/bilingual-title';

function extractEnglish(text: string): string {
  let s = stripBilingualMarkersForSpeech(text);
  s = s.replace(/\[\[(.*?)\]\]/g, '$1').replace(/[[\]]/g, '');
  return s.trim();
}

export default function SpeakButton({
  text,
  className = '',
  size = 'sm',
}: {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const english = extractEnglish(text);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [ttsError, setTtsError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestGenRef = useRef(0);
  const errorClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAndRevoke = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAndRevoke();
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      speechRef.current = null;
      if (errorClearRef.current) clearTimeout(errorClearRef.current);
    };
  }, [stopAndRevoke]);

  const speak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!english || loading) return;

    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      if (isSpeaking) {
        synth.cancel();
        speechRef.current = null;
        setIsSpeaking(false);
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(english);
      utterance.lang = 'en-GB';
      const voice = synth.getVoices().find((item) => /^en(-|_)/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.onend = () => { speechRef.current = null; setIsSpeaking(false); };
      utterance.onerror = () => { speechRef.current = null; setIsSpeaking(false); setTtsError(true); };
      speechRef.current = utterance;
      setTtsError(false);
      setIsSpeaking(true);
      synth.speak(utterance);
      return;
    }

    if (errorClearRef.current) clearTimeout(errorClearRef.current);
    setTtsError(false);

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;
    const gen = ++requestGenRef.current;

    stopAndRevoke();
    setLoading(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text: english }),
        signal,
      });
      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
      const blob = await res.blob();
      if (signal.aborted) return;
      if (blob.size < 64) throw new Error('TTS empty response');
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        stopAndRevoke();
      };
      await audio.play();
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      console.error('SpeakButton TTS:', err);
      if (gen === requestGenRef.current) {
        setTtsError(true);
        errorClearRef.current = setTimeout(() => setTtsError(false), 5000);
      }
    } finally {
      if (gen === requestGenRef.current) setLoading(false);
    }
  };

  if (!english) return null;

  const sz = size === 'sm' ? 'p-1 h-6 w-6' : 'p-1.5 h-8 w-8';
  const ic = size === 'sm' ? 13 : 17;
  const preview = english.length > 48 ? `${english.slice(0, 48)}…` : english;

  return (
    <button
      onClick={speak}
      type="button"
      disabled={loading}
      title={
        ttsError
          ? 'No se pudo generar el audio (Cloudflare). Reintenta o revisa la configuración del servidor.'
          : loading
            ? 'Generando audio…'
            : isSpeaking
              ? 'Detener audio'
              : `Escuchar (voz del navegador): "${preview}"`
      }
      aria-label={ttsError ? 'Error al generar audio' : isSpeaking ? 'Detener audio' : 'Escuchar pronunciación'}
      className={`inline-flex items-center justify-center rounded-full transition-colors flex-shrink-0 disabled:opacity-70 ${
        ttsError
          ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
          : 'bg-blue-50 hover:bg-blue-100 text-blue-500'
      } ${sz} ${className}`}
    >
      {loading ? (
        <Loader2 size={ic} className="animate-spin" aria-hidden />
      ) : ttsError ? (
        <AlertCircle size={ic} aria-hidden />
      ) : isSpeaking ? (
        <Pause size={ic} aria-hidden />
      ) : (
        <Volume2 size={ic} aria-hidden />
      )}
    </button>
  );
}
