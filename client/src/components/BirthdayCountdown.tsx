import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Cake, Sparkles, Gift, Play, Volume2, Heart, Calendar } from 'lucide-react';
import { SiteSettings } from '../types';

interface BirthdayCountdownProps {
  settings: SiteSettings;
  previewBirthdayMode?: boolean;
}

export const BirthdayCountdown: React.FC<BirthdayCountdownProps> = ({
  settings,
  previewBirthdayMode = false
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isBirthday: boolean;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthday: false,
    isPast: false
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [forcePreview, setForcePreview] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      // November 20, 2026 in Africa/Cairo (UTC+2 or UTC+3 depending on DST)
      // Parse settings.birthdayDate (default "2026-11-20")
      const targetDateStr = `${settings.birthdayDate || '2026-11-20'}T00:00:00+02:00`;
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();

      // Check if current date is the birthday day (within 24 hours of start of birthday)
      const birthdayEnd = targetTime + 24 * 60 * 60 * 1000;

      const difference = targetTime - now;

      if (now >= targetTime && now < birthdayEnd) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthday: true,
          isPast: false
        });
      } else if (now >= birthdayEnd) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthday: false,
          isPast: true
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isBirthday: false,
          isPast: false
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.birthdayDate]);

  // Is birthday active (either naturally or forced preview)?
  const isBirthdayActive = previewBirthdayMode || forcePreview || timeLeft.isBirthday;

  // Trigger confetti when birthday active
  useEffect(() => {
    if (isBirthdayActive && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f43f6c', '#ffd700', '#ff69b4', '#e0b0ff', '#ffb6c1']
      });
    }
  }, [isBirthdayActive, hasCelebrated]);

  const triggerBirthdayConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff4081', '#ff80ab', '#ffd54f', '#b388ff', '#ff5252']
    });
  };

  return (
    <section id="birthday-section" className="py-20 px-4 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="paper-texture p-6 sm:p-10 md:p-12 rounded-3xl border border-rose-200/90 shadow-2xl relative">
          {/* Subtle washi tape decoration */}
          <div className="washi-tape" style={{ top: '-12px' }} />

          {/* Header Tag */}
          <div className="flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              November 20, 2026 ({settings.timezone || 'Africa/Cairo'})
            </span>

            {/* Preview switch for the user */}
            <button
              onClick={() => {
                setForcePreview(!forcePreview);
                if (!forcePreview) triggerBirthdayConfetti();
              }}
              className="text-xs text-rose-600 hover:text-rose-800 bg-white/80 border border-rose-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 shadow-sm"
              title="Toggle to preview the full birthday celebration screen"
            >
              <Cake className="w-3 h-3 text-rose-500" />
              <span>{forcePreview ? 'Back to Countdown' : 'Preview Birthday Reveal 🎂'}</span>
            </button>
          </div>

          {!isBirthdayActive && !timeLeft.isPast && (
            /* COUNTDOWN STATE BEFORE NOVEMBER 20 */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100/80 mx-auto flex items-center justify-center text-rose-600 mb-4 shadow-inner">
                <Cake className="w-8 h-8 animate-pulse-soft" />
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-rose-950 mb-3">
                Counting down to your special day, {settings.recipientName} ♡
              </h2>
              <p className="text-rose-700/80 text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
                Every second brings us closer to celebrating the most beautiful soul in my life.
              </p>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-8">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 border border-rose-150 rounded-2xl p-3 sm:p-5 shadow-md flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
                  >
                    <span className="font-serif text-2xl sm:text-4xl font-bold text-rose-900 tracking-tight">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-rose-500 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="font-handwriting text-xl text-rose-700 select-none">
                "November 20th is the best day of the whole year." ✨
              </p>
            </div>
          )}

          {isBirthdayActive && (
            /* ACTIVE BIRTHDAY CELEBRATION */
            <div className="text-center animate-fade-in">
              <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-600 mb-4 animate-bounce">
                <Cake className="w-10 h-10" />
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 leading-tight">
                {settings.birthdayMessage.heading || `Happy Birthday, My Beautiful ${settings.recipientName}! 🎉🎂❤️`}
              </h2>
              <p className="text-rose-700 text-base sm:text-lg max-w-xl mx-auto mb-8 font-serif italic">
                {settings.birthdayMessage.subheading || "Today the whole world celebrates the absolute sweetest soul in it."}
              </p>

              {/* Special Birthday Note Card */}
              <div className="bg-white/90 border border-rose-200 rounded-2xl p-6 sm:p-8 text-left shadow-lg max-w-2xl mx-auto mb-8 relative">
                <div className="absolute top-4 right-4 text-rose-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="font-serif text-rose-950 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {settings.birthdayMessage.letter ||
                    `To my favorite person in the entire world — Happy Birthday! Looking back at all our memories, I'm so grateful for every laugh, every quiet moment, and every adventure we've shared. May this year bring you all the warmth, joy, and dreams you truly deserve. I love you more than words could ever describe.`}
                </p>
                <div className="mt-4 pt-4 border-t border-rose-100 flex justify-between items-center text-xs text-rose-500 font-sans">
                  <span>With all my love</span>
                  <span className="font-handwriting text-lg text-rose-700">Forever & Always ♡</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setShowSurpriseModal(true);
                    triggerBirthdayConfetti();
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-700 text-white font-medium text-base shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Gift className="w-5 h-5 text-rose-200" />
                  <span>Your Birthday Surprise is Here! 🎁</span>
                </button>

                <button
                  onClick={triggerBirthdayConfetti}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-rose-200 text-rose-700 font-medium text-base hover:bg-rose-50 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Shower More Confetti! ✨</span>
                </button>
              </div>
            </div>
          )}

          {!isBirthdayActive && timeLeft.isPast && (
            /* AFTER BIRTHDAY PASSED */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center text-rose-600 mb-4">
                <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950 mb-3">
                Remembering Your Birthday Celebration, {settings.recipientName} ♡
              </h2>
              <p className="text-rose-700 text-base max-w-xl mx-auto mb-6">
                November 20, 2026 was magical. Here's to making every single day just as unforgettable as your birthday.
              </p>
              <button
                onClick={() => setForcePreview(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors shadow-sm"
              >
                <span>Relive the Birthday Reveal 🎂</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Birthday Surprise Video/Audio Modal */}
      {showSurpriseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-rose-200 text-center">
            <button
              onClick={() => setShowSurpriseModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              ×
            </button>

            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
              A Personal Birthday Message For You
            </h3>
            <p className="text-rose-700/80 text-sm mb-6 font-sans">
              Recorded and saved just for this special day.
            </p>

            {/* Video or Audio Player if configured */}
            {settings.birthdayMessage.videoUrl ? (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-inner mb-6">
                <video
                  src={settings.birthdayMessage.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : settings.birthdayMessage.voiceNoteUrl ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-6 flex flex-col items-center gap-3">
                <Volume2 className="w-8 h-8 text-rose-500 animate-pulse" />
                <span className="text-sm font-medium text-rose-800">Voice Note from your love ♡</span>
                <audio src={settings.birthdayMessage.voiceNoteUrl} controls className="w-full mt-2" />
              </div>
            ) : (
              <div className="bg-rose-50/80 border border-dashed border-rose-200 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center gap-2">
                <Play className="w-8 h-8 text-rose-400" />
                <span className="font-serif text-rose-800 font-semibold text-lg">Your Special Birthday Video / Voice Note</span>
                <span className="text-xs text-rose-600/80 max-w-xs">
                  (You can upload your personal video or voice recording in the Admin Panel to show here!)
                </span>
              </div>
            )}

            <button
              onClick={() => setShowSurpriseModal(false)}
              className="w-full py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-colors shadow-md shadow-rose-500/20"
            >
              Close with a smile ♡
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
