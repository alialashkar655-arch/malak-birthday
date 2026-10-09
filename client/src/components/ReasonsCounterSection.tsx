import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReasonsCounterSectionProps {
  reasons: string[];
  recipientName: string;
}

export const ReasonsCounterSection: React.FC<ReasonsCounterSectionProps> = ({
  reasons,
  recipientName
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = reasons.length;

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleHeartBurst = () => {
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f43f6c', '#fe6d8f', '#ffa6b8']
    });
  };

  return (
    <section className="py-20 px-4 max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 mb-4 text-rose-700 text-xs sm:text-sm font-medium">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>A Few of Countless Reasons</span>
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950 mb-3 tracking-tight">
        Reasons I Love You, {recipientName} ♡
      </h2>
      <p className="text-rose-700/80 text-sm sm:text-base max-w-md mx-auto mb-8 font-sans">
        If I wrote down every single reason, the website would never end. Here are just a few:
      </p>

      {/* Interactive Flashcard */}
      <div className="paper-texture p-8 sm:p-12 rounded-3xl border border-rose-200/90 shadow-xl relative min-h-[220px] flex flex-col justify-between max-w-xl mx-auto">
        <div className="washi-tape" style={{ top: '-12px' }} />

        {/* Counter Badge */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-500">
            Reason #{currentIndex + 1}
          </span>
          <span className="text-xs text-rose-400 font-sans">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Reason Text */}
        <div className="my-auto py-2">
          <p className="font-serif text-xl sm:text-2xl text-rose-950 leading-relaxed font-semibold italic">
            "{reasons[currentIndex]}"
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-rose-150 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition-colors"
            title="Previous reason"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleHeartBurst}
            className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 transition-colors bg-white px-3 py-1.5 rounded-full border border-rose-200 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Send Love</span>
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition-colors"
            title="Next reason"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
