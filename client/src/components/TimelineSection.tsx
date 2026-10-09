import React, { useState } from 'react';
import { TimelineEntry } from '../types';
import { Sparkles, Calendar, Shuffle, Heart, Camera, Film } from 'lucide-react';

interface TimelineSectionProps {
  entries: TimelineEntry[];
  onOpenLightbox?: (mediaUrl: string, title: string, caption: string, isVideo: boolean) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ entries, onOpenLightbox }) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handlePickRandom = () => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    const chosen = entries[randomIndex];
    setHighlightedId(chosen.id);

    // Scroll to it smoothly
    const el = document.getElementById(`timeline-card-${chosen.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear highlight after 3.5s
    setTimeout(() => {
      setHighlightedId(null);
    }, 3500);
  };

  const getStickerBadge = (sticker?: string) => {
    switch (sticker) {
      case 'heart':
        return <span className="text-rose-500 font-serif text-lg">❤️</span>;
      case 'star':
        return <span className="text-amber-400 font-serif text-lg">⭐</span>;
      case 'flower':
        return <span className="text-pink-400 font-serif text-lg">🌸</span>;
      case 'stamp':
        return <span className="text-rose-800 text-xs px-2 py-0.5 rounded border border-rose-300 font-serif uppercase tracking-widest bg-rose-50">AIR MAIL</span>;
      case 'sparkle':
        return <span className="text-amber-500 font-serif text-lg">✨</span>;
      default:
        return <span className="text-rose-400 font-serif text-lg">♡</span>;
    }
  };

  return (
    <section id="our-story" className="py-24 px-4 relative max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 mb-4 text-rose-700 text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>The Story of Us</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-4 tracking-tight">
          Our Little Story ♡
        </h2>
        <p className="text-rose-800/80 text-base sm:text-lg max-w-xl mx-auto mb-6">
          Every chapter with you is a page I want to reread for the rest of my life.
        </p>

        {/* Random Memory Button */}
        <button
          onClick={handlePickRandom}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm active:scale-95"
        >
          <Shuffle className="w-4 h-4 text-rose-500" />
          <span>Pick a Random Memory for Us</span>
        </button>
      </div>

      {/* Scrapbook Timeline Container */}
      <div className="relative">
        {/* Central dashed line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-rose-200 pointer-events-none" />

        <div className="space-y-12 md:space-y-16">
          {entries.map((entry, idx) => {
            const isEven = idx % 2 === 0;
            const isHighlighted = highlightedId === entry.id;

            return (
              <div
                key={entry.id}
                id={`timeline-card-${entry.id}`}
                className={`relative flex flex-col md:flex-row items-center transition-all duration-500 ${
                  isEven ? 'md:flex-row-reverse' : ''
                } ${isHighlighted ? 'scale-105 z-20' : ''}`}
              >
                {/* Timeline Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose-100 border-2 border-rose-400 items-center justify-center text-rose-600 shadow-sm z-10">
                  <span className="text-xs font-serif font-bold">{idx + 1}</span>
                </div>

                {/* Card Content (Half width on desktop) */}
                <div className={`w-full md:w-[46%] ${isEven ? 'md:pl-6' : 'md:pr-6'}`}>
                  <div
                    className={`paper-texture p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                      isHighlighted
                        ? 'border-rose-500 shadow-soft-glow ring-2 ring-rose-400/40'
                        : 'border-rose-200/80 shadow-scrapbook hover:shadow-xl'
                    }`}
                  >
                    {/* Polaroid tape on top */}
                    <div className="washi-tape" style={{ transform: isEven ? 'translateX(-50%) rotate(1.5deg)' : 'translateX(-50%) rotate(-1.5deg)' }} />

                    {/* Top Row: Date & Sticker */}
                    <div className="flex items-center justify-between mb-3 pt-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-150">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span>{entry.date || `Memory #${idx + 1}`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStickerBadge(entry.sticker)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950 mb-3">
                      {entry.title}
                    </h3>

                    {/* Media Display */}
                    <div
                      className="polaroid-frame mb-4 cursor-pointer relative group overflow-hidden"
                      onClick={() =>
                        onOpenLightbox &&
                        onOpenLightbox(
                          entry.mediaUrl,
                          entry.title,
                          entry.caption,
                          entry.mediaType === 'video'
                        )
                      }
                    >
                      <div className="relative aspect-[4/3] rounded bg-rose-50 overflow-hidden border border-rose-100">
                        {entry.mediaType === 'video' ? (
                          <div className="relative w-full h-full bg-black flex items-center justify-center">
                            <video
                              src={entry.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Film className="w-10 h-10 text-white/90 drop-shadow" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={entry.mediaUrl}
                            alt={entry.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `/placeholders/timeline_${(idx % 7) + 1}.jpg`;
                            }}
                          />
                        )}

                        {/* Hover Zoom hint */}
                        <div className="absolute inset-0 bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs bg-rose-900/70 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" /> Tap to enlarge
                          </span>
                        </div>
                      </div>

                      {/* Handwritten Note underneath polaroid */}
                      {entry.handwrittenNote && (
                        <p className="font-handwriting text-2xl text-rose-800 text-center mt-3 select-none">
                          {entry.handwrittenNote}
                        </p>
                      )}
                    </div>

                    {/* Caption Paragraph */}
                    <p className="text-rose-900/90 text-sm sm:text-base leading-relaxed font-sans">
                      {entry.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
