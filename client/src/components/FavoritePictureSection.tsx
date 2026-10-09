import React, { useState } from 'react';
import { Heart, Sparkles, MapPin, Calendar, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../types';

interface FavoritePictureSectionProps {
  settings: SiteSettings;
  compliments: string[];
}

export const FavoritePictureSection: React.FC<FavoritePictureSectionProps> = ({
  settings,
  compliments
}) => {
  const [currentComplimentIndex, setCurrentComplimentIndex] = useState(0);
  const [complimentAnim, setComplimentAnim] = useState(false);

  const fav = settings.favoritePhoto;

  const handleNextCompliment = () => {
    if (compliments.length === 0) return;
    setComplimentAnim(true);

    // Heart burst
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f6c', '#fe6d8f', '#ffa6b8', '#ffccd5']
    });

    setTimeout(() => {
      setCurrentComplimentIndex(prev => (prev + 1) % compliments.length);
      setComplimentAnim(false);
    }, 200);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-rose-50/50 to-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 mb-4 text-rose-800 text-xs sm:text-sm font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Spotlight Memory</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
            My Favorite Picture of You 🥹
          </h2>
          <p className="text-rose-800/80 text-base sm:text-lg max-w-lg mx-auto">
            Out of every picture in the world, this is the one that makes my heart stop every single time.
          </p>
        </div>

        {/* Vintage Film / Polaroid Presentation Card */}
        <div className="paper-texture rounded-3xl p-6 sm:p-10 border border-rose-200/90 shadow-2xl relative">
          <div className="washi-tape" style={{ top: '-14px' }} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* The Large Portrait Frame */}
            <div className="md:col-span-7 flex justify-center">
              <div className="polaroid-frame w-full max-w-sm rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[3/4] rounded overflow-hidden bg-rose-50 shadow-inner border border-rose-100">
                  <img
                    src={fav.imageUrl || "/placeholders/favorite_portrait.jpg"}
                    alt={`Favorite picture of ${settings.recipientName}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/placeholders/favorite_portrait.jpg';
                    }}
                  />
                  {/* Subtle film grain & light leak effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/10 pointer-events-none" />
                </div>

                {/* Handwritten note at bottom of polaroid */}
                <div className="pt-4 text-center">
                  <p className="font-handwriting text-2xl sm:text-3xl text-rose-900 leading-none select-none">
                    {fav.handwrittenNote || "My favorite view in every lifetime. ♡"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details & Compliment Generator */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-6">
              {/* Badges for Date & Location */}
              <div className="flex flex-wrap items-center gap-2">
                {fav.date && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-800 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {fav.date}
                  </span>
                )}
                {fav.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-800 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {fav.location}
                  </span>
                )}
              </div>

              {/* Love Caption */}
              <div className="border-l-2 border-rose-300 pl-4 py-1">
                <p className="font-serif text-rose-950 text-base sm:text-lg leading-relaxed italic">
                  "{fav.caption || "You were laughing so hard your eyes crinkled up, and I just remember looking at you and thinking that I never want to be anywhere else in the world."}"
                </p>
              </div>

              {/* Interactive Compliment Reveal Box */}
              <div className="bg-white/80 rounded-2xl p-5 border border-rose-200/80 shadow-sm relative">
                <span className="text-[11px] uppercase tracking-wider text-rose-500 font-semibold block mb-2">
                  Compliment for {settings.recipientName} ♡
                </span>

                <p
                  className={`font-serif text-rose-900 text-base leading-relaxed transition-opacity duration-200 min-h-[48px] flex items-center ${
                    complimentAnim ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {compliments.length > 0
                    ? compliments[currentComplimentIndex]
                    : "The way you smile makes the whole world brighter."}
                </p>

                <div className="mt-4 pt-3 border-t border-rose-100 flex justify-end">
                  <button
                    onClick={handleNextCompliment}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                    <span>Another reason you're beautiful ♡</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
