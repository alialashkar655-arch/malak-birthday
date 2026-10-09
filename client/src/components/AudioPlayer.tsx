import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

interface AudioPlayerProps {
  customAudioUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ customAudioUrl }) => {
  // Always default directly to /our_song.mp3
  const audioSrc = (customAudioUrl && customAudioUrl.trim() !== '') 
    ? customAudioUrl.trim() 
    : '/our_song.mp3';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const userManuallyPausedRef = useRef<boolean>(false);
  const listenersCleanedRef = useRef<boolean>(false);

  const isStartingRef = useRef<boolean>(false);

  const cleanupListeners = useCallback(() => {
    if (listenersCleanedRef.current) return;
    listenersCleanedRef.current = true;
    document.removeEventListener('pointerdown', handleInteraction);
    document.removeEventListener('click', handleInteraction);
    window.removeEventListener('start-romantic-music', handleCustomEvent);
  }, []);

  const startPlayback = useCallback(() => {
    userManuallyPausedRef.current = false;
    if (isStartingRef.current) return;

    if (audioElementRef.current) {
      isStartingRef.current = true;
      audioElementRef.current.volume = 0.85;
      audioElementRef.current.muted = isMuted;

      const promise = audioElementRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
            isStartingRef.current = false;
            cleanupListeners();
          })
          .catch((e) => {
            isStartingRef.current = false;
            console.log('Autoplay waiting for touch:', e.message);
          });
      } else {
        isStartingRef.current = false;
      }
    }
  }, [isMuted, cleanupListeners]);

  const handleInteraction = useCallback(() => {
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

  useEffect(() => {
    userManuallyPausedRef.current = false;
    listenersCleanedRef.current = false;

    // 1. Try immediate autoplay
    startPlayback();

    // 2. Global listeners on pointerdown and click
    document.addEventListener('pointerdown', handleInteraction, { passive: true, once: true });
    document.addEventListener('click', handleInteraction, { passive: true, once: true });
    window.addEventListener('start-romantic-music', handleCustomEvent);

    return () => {
      cleanupListeners();
    };
  }, [audioSrc, startPlayback, handleInteraction, handleCustomEvent, cleanupListeners]);

  return (
    <aside
      aria-label="Romantic music controls"
      className="fixed bottom-5 left-5 z-40 bg-white/95 backdrop-blur-md border border-rose-200/90 px-4 py-2.5 rounded-full shadow-lg shadow-rose-900/10 flex items-center space-x-3 transition-all hover:bg-white hover:shadow-rose-900/20"
    >
      <audio
        ref={audioElementRef}
        src={audioSrc}
        loop
        preload="none"
        playsInline
        onEnded={() => {
          if (audioElementRef.current) {
            audioElementRef.current.currentTime = 0;
            audioElementRef.current.play().catch(() => {});
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (userManuallyPausedRef.current) {
            setIsPlaying(false);
          }
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
        className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
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
          className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </aside>
  );
};
