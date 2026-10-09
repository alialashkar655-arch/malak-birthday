import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloatingHeartsButtonProps {
  recipientName: string;
}

export const FloatingHeartsButton: React.FC<FloatingHeartsButtonProps> = ({ recipientName }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showSecretNote, setShowSecretNote] = useState(false);

  const handleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // Heart confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: 0.9, y: 0.9 },
      colors: ['#f43f6c', '#fe6d8f', '#ffa6b8', '#ffccd5']
    });

    // Easter egg on 5th click
    if (nextCount % 5 === 0) {
      setShowSecretNote(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Send hearts"
        title="Tap to shower love ♡"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 hover:scale-110 active:scale-95 transition-all group"
      >
        <Heart className="w-6 h-6 fill-white group-hover:scale-110 transition-transform animate-pulse" />
      </button>

      {/* Secret Love Note Easter Egg Modal */}
      {showSecretNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="paper-texture rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border-2 border-rose-300 animate-scale-up">
            <button
              onClick={() => setShowSecretNote(false)}
              className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-rose-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h4 className="font-serif text-xl font-bold text-rose-950 mb-2">
              Secret Easter Egg Found! 💖
            </h4>

            <p className="font-serif text-rose-900 text-sm leading-relaxed mb-4">
              "You clicked the heart {clickCount} times! Just wanted to tell you: you're the absolute prettiest person in every single room you ever walk into, {recipientName}." ♡
            </p>

            <button
              onClick={() => setShowSecretNote(false)}
              className="w-full py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs transition-colors shadow-sm"
            >
              Awww, thank you ♡
            </button>
          </div>
        </div>
      )}
    </>
  );
};
