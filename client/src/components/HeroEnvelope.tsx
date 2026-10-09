import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Mail, ChevronDown } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroEnvelopeProps {
  settings: SiteSettings;
  onOpenExperience?: () => void;
}

export const HeroEnvelope: React.FC<HeroEnvelopeProps> = ({ settings, onOpenExperience }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Immediately trigger romantic music on envelope open
    try {
      window.dispatchEvent(new Event('start-romantic-music'));
    } catch {
      // ignore
    }

    // Sweet confetti burst
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f6c', '#fe6d8f', '#ffa6b8', '#ffd0d9', '#d4af37']
    });

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      if (onOpenExperience) {
        onOpenExperience();
      }
      // Smooth scroll to next section
      const storyEl = document.getElementById('our-story');
      if (storyEl) {
        storyEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 900);
  };

  return (
    <section className="relative min-h-[90svh] sm:min-h-[92vh] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Decorative background sparkles & floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-10 text-rose-300/60 animate-bounce duration-1000 text-2xl select-none">♡</div>
        <div className="absolute top-1/4 right-12 text-rose-400/50 animate-pulse text-3xl select-none">✨</div>
        <div className="absolute bottom-24 left-1/5 text-rose-300/40 text-xl animate-soft-float select-none">🌸</div>
        <div className="absolute bottom-1/3 right-1/4 text-rose-300/40 text-2xl select-none">♡</div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,228,230,0.7)_0%,transparent_70%)] pointer-events-none -z-10" />
      </div>

      <div className="max-w-4xl w-full mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Sweet Little Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 shadow-sm mb-6 text-rose-700 text-xs sm:text-sm font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>{settings.heroSubtitle || "A little something, just for you."}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>

        {/* Large Elegant Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-rose-950 tracking-tight leading-tight mb-5 max-w-3xl">
          {settings.heroTitle || `For ${settings.recipientName}, my favorite person ♡`}
        </h1>

        {/* Romantic Introduction */}
        <p className="text-rose-800/80 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          {settings.heroIntro || "Every memory with you is my favorite place to be. I made this little universe to remind you just how special, loved, and deeply adored you are."}
        </p>

        {/* The Sealed Romantic Envelope & Photo Card Experience */}
        <div className="relative w-full max-w-md mx-auto mb-10">
          {/* Polaroid style container with slight tilt */}
          <div className="relative group transition-transform duration-500 hover:scale-[1.02]">
            {/* Scrapbook washi tape */}
            <div className="washi-tape" />

            <div className="polaroid-frame bg-white p-4 pb-8 sm:p-5 sm:pb-10 rounded-lg shadow-xl shadow-rose-950/10 border border-rose-100/80">
              <div className="relative aspect-[4/3] rounded overflow-hidden bg-rose-50/50 mb-4 border border-rose-100">
                <img
                  src={settings.heroPhotoUrl || "/placeholders/hero_together.jpg"}
                  alt={`Our favorite picture together with ${settings.recipientName}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/placeholders/hero_together.jpg';
                  }}
                />
                
                {/* Vintage vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 via-transparent to-transparent pointer-events-none" />

                {/* Wax seal over photo button if unopened */}
                {!isOpen && (
                  <div className="absolute inset-0 bg-rose-950/15 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                    <button
                      onClick={handleOpen}
                      disabled={isOpening}
                      className="group/seal relative flex flex-col items-center justify-center p-4 focus:outline-none"
                    >
                      {/* Romantic wax seal stamp */}
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-burgundy-900 shadow-2xl flex items-center justify-center border-4 border-rose-300/40 transform transition-all duration-300 ${isOpening ? 'scale-125 rotate-12 opacity-80' : 'group-hover/seal:scale-110'}`}>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed border-rose-300/60 flex flex-col items-center justify-center text-rose-100">
                          <span className="font-serif font-bold text-lg sm:text-xl tracking-widest">{settings.recipientName.charAt(0) || 'M'}</span>
                          <span className="text-[10px] -mt-1 font-serif">♡</span>
                        </div>
                      </div>
                      <span className="mt-2 text-xs font-handwriting text-white text-shadow text-base drop-shadow-md bg-rose-900/60 px-3 py-0.5 rounded-full">
                        {isOpening ? 'Opening for you...' : 'Tap wax seal to open'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Polaroid Caption */}
              <p className="font-handwriting text-2xl sm:text-3xl text-rose-900 text-center -rotate-1 select-none">
                "Forever my favorite person in the room." ♡
              </p>
            </div>
          </div>
        </div>

        {/* Primary Interactive Open Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleOpen}
            disabled={isOpening}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white font-medium text-base sm:text-lg shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Mail className="w-5 h-5 text-rose-200 group-hover:rotate-12 transition-transform duration-300" />
            <span>{settings.heroButtonText || "Open your little world 💌"}</span>
            <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
          </button>

          <span className="text-xs text-rose-500/80 font-handwriting text-base">
            Turn on audio in the bottom corner for gentle music ♡
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 animate-bounce text-rose-400">
          <ChevronDown className="w-6 h-6 mx-auto opacity-70" />
        </div>
      </div>
    </section>
  );
};
