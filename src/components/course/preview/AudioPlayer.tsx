'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, FileText, Loader2 } from 'lucide-react';
import { trackAudioPlayback } from '@/lib/analytics';

function stripMarkup(text: string): string {
  return text.replace(/\[\[([^\|]+)\|[^\]]+\]\]/g, '$1');
}

interface AudioPlayerProps {
  audioUrl?: string;
  ttsText?: string;
  transcript?: string;
  className?: string;
  unitId?: string;
}

export function AudioPlayer({ audioUrl, ttsText, transcript, className = '', unitId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ttsError, setTtsError] = useState(false);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (speechRef.current && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        speechRef.current = null;
      }
    };
  }, [blobUrl]);

  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;

    // Listening sin archivo: usar la voz integrada del navegador (Web Speech API).
    if (!audioUrl && ttsText) {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
        setTtsError(true);
        return;
      }
      if (isPlaying) {
        synth.pause();
        setIsPlaying(false);
        trackAudioPlayback('pause', unitId);
        return;
      }
      if (synth.paused && speechRef.current) {
        synth.resume();
        setIsPlaying(true);
        trackAudioPlayback('play', unitId);
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(stripMarkup(ttsText));
      utterance.lang = 'en-GB';
      utterance.rate = playbackRate;
      const englishVoice = synth.getVoices().find((voice) => /^en(-|_)/i.test(voice.lang));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.onend = () => {
        speechRef.current = null;
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        speechRef.current = null;
        setIsPlaying(false);
        setTtsError(true);
      };
      speechRef.current = utterance;
      setTtsError(false);
      synth.speak(utterance);
      setIsPlaying(true);
      trackAudioPlayback('play', unitId);
      return;
    }

    if (!audioUrl && ttsText && !blobUrl && !isGenerating) {
      setIsGenerating(true);
      setTtsError(false);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ text: ttsText }),
        });
        if (!res.ok) throw new Error('TTS failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        audioRef.current.src = url;
        await audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
        trackAudioPlayback('play', unitId);
      } catch {
        setTtsError(true);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      trackAudioPlayback('pause', unitId);
    } else {
      audioRef.current.play();
      trackAudioPlayback('play', unitId);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, unitId, audioUrl, ttsText, blobUrl, isGenerating]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    trackAudioPlayback('seek', unitId, Math.round(newTime));
  };

  const handleSpeedChange = (speed: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
    if (speechRef.current) speechRef.current.rate = speed;
    setPlaybackRate(speed);
    trackAudioPlayback('speed_change', unitId, speed);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!audioRef.current) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          audioRef.current.currentTime = Math.max(0, currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          audioRef.current.currentTime = Math.min(duration, currentTime + 5);
          break;
      }
    },
    [togglePlayPause, currentTime, duration]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm ${className}`}>
      <audio ref={audioRef} src={blobUrl || audioUrl || ''} preload="metadata" />

      <div className="flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          
          <div
            role="progressbar"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            className="flex-1 h-2 bg-slate-100 rounded-full cursor-pointer relative group"
            onClick={handleSeek}
          >
            <div
              className="absolute h-full bg-[#FF6B6B] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute h-4 w-4 bg-[#FF6B6B] rounded-full top-1/2 -translate-y-1/2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>

          <span className="text-xs font-medium text-slate-500 min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            disabled={isGenerating}
            aria-label={isGenerating ? 'Generando audio...' : isPlaying ? 'Pause' : 'Play'}
            className="flex items-center justify-center w-12 h-12 bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-70 text-white rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-1">
            {[0.75, 1, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                aria-label={`Speed ${speed}x`}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  playbackRate === speed
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 text-slate-600 hover:text-[#FF6B6B] transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
              className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B6B] [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FF6B6B] [&::-moz-range-thumb]:border-0"
            />
          </div>

          {/* Transcript Toggle */}
          {transcript && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              aria-label="Toggle transcript"
              aria-pressed={showTranscript}
              className={`p-2 rounded-lg transition-colors ${
                showTranscript
                  ? 'bg-[#FF6B6B] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* TTS error */}
        {ttsError && (
          <p className="text-xs text-red-500 text-center">
            No se pudo generar el audio. Inténtalo de nuevo.
          </p>
        )}

        {/* Transcript */}
        {transcript && showTranscript && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Transcripción</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{stripMarkup(transcript)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
