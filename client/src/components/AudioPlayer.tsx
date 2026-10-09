import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

interface AudioPlayerProps {
  customAudioUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ customAudioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Web Audio synth for ambient romantic chords
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Gentle romantic chord progression: Cmaj7 -> Am7 -> Fmaj7 -> Gsus4
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 261.63, 293.66, 392.00]  // Gsus4 (G3, C4, D4, G4)
  ];
  const chordIndexRef = useRef(0);

  const playSynthesizedChord = () => {
    if (!audioCtxRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const currentChord = chords[chordIndexRef.current];
    chordIndexRef.current = (chordIndexRef.current + 1) % chords.length;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);
    masterGain.connect(ctx.destination);

    currentChord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      // Warm sine + soft triangle
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.6 + idx * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.6);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + 3.8);
    });
  };

  const startPlayback = () => {
    setHasInteracted(true);
    setIsPlaying(true);

    if (customAudioUrl && audioElementRef.current) {
      audioElementRef.current.play().catch(e => console.log('Audio playback prevented:', e));
    } else {
      // Start procedural ambient synth
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      playSynthesizedChord();
      timerRef.current = window.setInterval(playSynthesizedChord, 4000);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
    setIsMuted(!isMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <aside 
      aria-label="Romantic music controls"
      className="fixed bottom-5 left-5 z-40 bg-white/85 backdrop-blur-md border border-rose-200/80 px-4 py-2.5 rounded-full shadow-lg shadow-rose-900/5 flex items-center space-x-3 transition-all hover:bg-white hover:shadow-rose-900/10"
    >
      {customAudioUrl && (
        <audio
          ref={audioElementRef}
          src={customAudioUrl}
          loop
          preload="none"
        />
      )}

      {/* Rotating vinyl icon */}
      <div className={`text-rose-500 relative flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
        <Disc className="w-5 h-5 text-rose-600" />
        <Music className="w-2.5 h-2.5 text-white absolute" />
      </div>

      <div className="flex flex-col pr-1">
        <span className="text-[11px] font-medium tracking-wide text-rose-800 uppercase flex items-center gap-1">
          {isPlaying ? (
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse delay-150" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
          )}
          {customAudioUrl ? 'Our Song' : 'Sweet Melody'}
        </span>
        <span className="text-[10px] text-rose-400 font-serif italic">
          {isPlaying ? 'Playing gently ♡' : 'Tap to play music'}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause background music" : "Play romantic background music"}
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
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </aside>
  );
};
