import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

interface AudioPlayerProps {
  customAudioUrl?: string;
}

const INTERACTION_EVENTS = [
  'click',
  'pointerdown',
  'touchstart',
  'touchend',
  'mousedown',
  'keydown',
  'scroll',
  'wheel'
] as const;

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ customAudioUrl }) => {
  // Always default directly to /our_song.mp3
  const audioSrc = (customAudioUrl && customAudioUrl.trim() !== '') 
    ? customAudioUrl.trim() 
    : '/our_song.mp3';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const userManuallyPausedRef = useRef<boolean>(false);
  const listenersActiveRef = useRef<boolean>(false);

  // Remove interaction listeners once audio is successfully playing
  const cleanupInteractionListeners = useCallback(() => {
    if (!listenersActiveRef.current) return;
    listenersActiveRef.current = false;
    INTERACTION_EVENTS.forEach((evt) => {
      window.removeEventListener(evt, handleAnyInteraction, true);
      document.removeEventListener(evt, handleAnyInteraction, true);
    });
  }, []);

  const startPlayback = useCallback(async () => {
    userManuallyPausedRef.current = false;
    const audio = audioElementRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.85;
      audio.muted = isMuted;
      await audio.play();
      setIsPlaying(true);
      cleanupInteractionListeners();
    } catch (e: any) {
      // Browser autoplay policy prevented direct unmuted playback without gesture
      console.log('Autoplay deferred until first user interaction:', e?.message || e);
    }
  }, [isMuted, cleanupInteractionListeners]);

  const handleAnyInteraction = useCallback(() => {
    if (!userManuallyPausedRef.current) {
      startPlayback();
    }
  }, [startPlayback]);

  const handleCustomEvent = useCallback(() => {
    startPlayback();
  }, [startPlayback]);

  const stopPlayback = () => {
    userManuallyPausedRef.current = true;
    setIsPlaying(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioElementRef.current) {
      audioElementRef.current.muted = nextMute;
    }
  };

  // Main effect: start autoplay on page load & setup global interaction listeners
  useEffect(() => {
    userManuallyPausedRef.current = false;

    // 1. Attempt immediate autoplay on load
    startPlayback();

    // 2. Attach global capture listeners to window & document for any user gesture
    listenersActiveRef.current = true;
    INTERACTION_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleAnyInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleAnyInteraction, { capture: true, passive: true });
    });

    // 3. Listen to explicit custom event (e.g. from envelope open or other UI triggers)
    window.addEventListener('start-romantic-music', handleCustomEvent);

    return () => {
      cleanupInteractionListeners();
      window.removeEventListener('start-romantic-music', handleCustomEvent);
    };
  }, [audioSrc, startPlayback, handleAnyInteraction, handleCustomEvent, cleanupInteractionListeners]);

  return (
    <aside
      aria-label="Romantic music controls"
      className="fixed bottom-5 left-5 z-40 bg-white/95 backdrop-blur-md border border-rose-200/90 px-4 py-2.5 rounded-full shadow-lg shadow-rose-900/10 flex items-center space-x-3 transition-all hover:bg-white hover:shadow-rose-900/20"
    >
      <audio
        ref={audioElementRef}
        src={audioSrc}
        loop
        preload="auto"
        autoPlay
        playsInline
        onCanPlay={() => {
          if (!isPlaying && !userManuallyPausedRef.current) {
            startPlayback();
          }
        }}
        onEnded={() => {
          if (audioElementRef.current) {
            audioElementRef.current.currentTime = 0;
            audioElementRef.current.play().catch(() => {});
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false);
        }}
      />

      {/* Rotating vinyl icon */}
      <div
        className={`text-rose-500 relative flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}
        style={{ animationDuration: '4.5s' }}
      >
        <Disc className="w-5 h-5 text-rose-600" />
        <Music className="w-2.5 h-2.5 text-white absolute" />
      </div>

      <div className="flex flex-col pr-1 select-none">
        <span className="text-[11px] font-semibold tracking-wide text-rose-900 uppercase flex items-center gap-1.5">
          {isPlaying ? (
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse delay-150" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
          )}
          Our Song ♡
        </span>
        <span className="text-[10px] text-rose-500 font-serif italic">
          {isPlaying ? 'Playing on loop ♡' : 'Tap anywhere to play'}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background music' : 'Play romantic background music'}
        className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        {isPlaying ? (
          <span className="flex space-x-0.5">
            <span className="w-1 h-3 bg-white rounded-full"></span>
            <span className="w-1 h-3 bg-white rounded-full"></span>
          </span>
        ) : (
          <span className="translate-x-0.5 text-xs">▶</span>
        )}
      </button>

      {/* Mute Button */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="text-rose-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </aside>
  );
};
