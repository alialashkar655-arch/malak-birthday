import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Coffee, Camera, Gift, X } from 'lucide-react';
import { LoveLettersData, OpenWhenNote } from '../types';

interface LoveLettersSectionProps {
  data: LoveLettersData;
  recipientName: string;
}

export const LoveLettersSection: React.FC<LoveLettersSectionProps> = ({ data, recipientName }) => {
  const [selectedNote, setSelectedNote] = useState<OpenWhenNote | null>(null);

  const getNoteIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-rose-500" />;
      case 'Gift':
        return <Gift className="w-5 h-5 text-rose-600" />;
      default:
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
    }
  };

  return (
    <section id="love-letters-section" className="py-24 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 mb-4 text-rose-700 text-xs sm:text-sm font-medium">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span>From My Heart to Yours</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
          Things I Don't Say Enough ♡
        </h2>
        <p className="text-rose-800/80 text-base sm:text-lg max-w-lg mx-auto">
          Words written down so you can keep them close, whenever you need a reminder.
        </p>
      </div>

      {/* Main Handwritten Love Letter Parchment */}
      <div className="paper-texture p-8 sm:p-14 rounded-3xl border border-rose-200/90 shadow-2xl relative mb-16">
        <div className="washi-tape" style={{ top: '-14px' }} />

        {/* Date and seal header */}
        <div className="flex items-center justify-between border-b border-rose-150 pb-4 mb-6 text-xs text-rose-500 font-sans">
          <span>{data.mainLetter.date || "November 20, 2026"}</span>
          <span className="font-serif italic">For My Dearest {recipientName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Letter Body */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-4">
              {data.mainLetter.title}
            </h3>

            <p className="font-serif text-rose-950 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {data.mainLetter.content}
            </p>

            {/* Sign off */}
            <div className="pt-6">
              <p className="font-handwriting text-2xl sm:text-3xl text-rose-800 select-none">
                {data.mainLetter.signOff || "With all my love, always and forever ♡"}
              </p>
            </div>
          </div>

          {/* Polaroid Attachment */}
          <div className="md:col-span-4 flex justify-center">
            <div className="polaroid-frame max-w-[200px] w-full rotate-2 hover:rotate-0 transition-transform">
              <div className="aspect-[4/5] rounded overflow-hidden bg-rose-50 border border-rose-100">
                <img
                  src={data.mainLetter.polaroidUrl || "/placeholders/letter_polaroid.jpg"}
                  alt="Polaroid Memory"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/placeholders/letter_polaroid.jpg';
                  }}
                />
              </div>
              <p className="font-handwriting text-xl text-rose-900 text-center mt-2 leading-none select-none">
                {data.mainLetter.polaroidCaption || "Forever my favorite person ♡"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "Open When..." Collection */}
      <div>
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
            The "Open When..." Letters 💌
          </h3>
          <p className="text-rose-700/80 text-sm max-w-md mx-auto">
            Click on any letter whenever you need a little piece of comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.openWhenNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="paper-texture p-5 rounded-2xl border border-rose-200/80 hover:border-rose-400/80 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group relative flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-full bg-rose-100/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getNoteIcon(note.icon)}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">
                  SEALED
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-rose-950 group-hover:text-rose-600 transition-colors mt-3">
                  {note.title}
                </h4>
                <span className="text-xs text-rose-500 font-handwriting text-base">
                  Tap to unseal ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Open When..." Letter Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="paper-texture rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-rose-300 animate-scale-up">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 text-rose-400 hover:text-rose-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                {getNoteIcon(selectedNote.icon)}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">
                  A Note for {recipientName}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950">
                  {selectedNote.title}
                </h3>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl p-5 border border-rose-150 shadow-inner mb-6">
              <p className="font-serif text-rose-950 text-base leading-relaxed whitespace-pre-line">
                {selectedNote.content}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-rose-500">
              <span className="font-handwriting text-lg text-rose-700">Forever thinking of you ♡</span>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs transition-colors"
              >
                Close letter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
