import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, CalendarHeart } from 'lucide-react';
import { DateInvitationData } from '../types';

interface DateInvitationSectionProps {
  data: DateInvitationData;
  recipientName: string;
  onAccepted: (choiceId: string, choiceLabel: string) => void;
}

export const DateInvitationSection: React.FC<DateInvitationSectionProps> = ({
  data,
  recipientName,
  onAccepted
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // Check if previously accepted in localStorage
  useEffect(() => {
    const savedChoice = localStorage.getItem('malak_date_invitation_choice');
    if (savedChoice) {
      setSelectedChoiceId(savedChoice);
      const matched = data.choices.find(c => c.id === savedChoice);
      if (matched) {
        setCelebrationMessage(matched.response);
      }
    }
  }, [data.choices]);

  const handleChoiceClick = (choiceId: string, choiceLabel: string, response: string) => {
    setSelectedChoiceId(choiceId);
    setCelebrationMessage(response);
    localStorage.setItem('malak_date_invitation_choice', choiceId);

    // Multi-burst confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f6c', '#fe6d8f', '#ffa6b8', '#ffccd5', '#d4af37']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f6c', '#ffd700', '#ff80ab']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f6c', '#ffd700', '#ff80ab']
      });
    }, 250);

    // Call parent handler
    onAccepted(choiceId, choiceLabel);
  };

  return (
    <section id="date-invitation-section" className="py-24 px-4 max-w-4xl mx-auto text-center relative">
      {/* Decorative floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-rose-300 text-3xl select-none animate-pulse">💖</div>
        <div className="absolute bottom-12 right-12 text-rose-300 text-3xl select-none animate-bounce">🌷</div>
      </div>

      <div className="paper-texture p-8 sm:p-14 rounded-3xl border-2 border-rose-200/90 shadow-2xl relative">
        <div className="washi-tape" style={{ top: '-14px' }} />

        {/* Small Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 mb-6 text-rose-700 text-xs sm:text-sm font-medium">
          <CalendarHeart className="w-4 h-4 text-rose-500" />
          <span>A Very Important Question</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </div>

        {/* Large Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
          {data.heading || `${recipientName}, can I take you on a date? 🥹`}
        </h2>

        {/* Question Subtext */}
        <p className="font-handwriting text-3xl sm:text-4xl text-rose-800 mb-4 select-none">
          "{data.question || 'Would you go out with me?'}"
        </p>

        <p className="text-rose-700/80 text-sm sm:text-base max-w-md mx-auto mb-10 font-sans">
          {data.subtitle || "I planned something special, but first I need your official answer..."}
        </p>

        {/* The Three Playful Positive Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-8">
          {data.choices.map(choice => {
            const isSelected = selectedChoiceId === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id, choice.label, choice.response)}
                className={`w-full sm:w-auto px-6 py-4 rounded-full font-serif text-lg font-bold transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105 ring-4 ring-rose-200'
                    : 'bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-900 hover:scale-105'
                }`}
              >
                <span>{choice.label}</span>
              </button>
            );
          })}
        </div>

        {/* Response Feedback Card */}
        {celebrationMessage && (
          <div className="animate-fade-in bg-rose-50 border border-rose-200 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
            <span className="text-2xl mb-1 block">🥰</span>
            <p className="font-serif font-bold text-xl text-rose-900 mb-2">
              {celebrationMessage}
            </p>
            <p className="text-xs text-rose-600 font-sans">
              Keep scrolling down to customize our dream date together! 🌷
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
