import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ChevronRight, ChevronLeft, Heart, Send, Calendar, Clock, Utensils, Flower2 } from 'lucide-react';
import { DateQuestion, DateSubmission } from '../types';
import { api } from '../services/api';

interface DatePlannerProps {
  questions: DateQuestion[];
  recipientName: string;
  invitationAnswerId: string;
  invitationAnswerLabel: string;
}

export const DatePlanner: React.FC<DatePlannerProps> = ({
  questions,
  recipientName,
  invitationAnswerId,
  invitationAnswerLabel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('malak_date_submitted'));
  });

  // State for responses
  const [selectedDateTypes, setSelectedDateTypes] = useState<string[]>(['picnic']);
  const [selectedFlowerColor, setSelectedFlowerColor] = useState<string>('red_roses');
  const [selectedFlowerTypes, setSelectedFlowerTypes] = useState<string[]>(['roses']);
  const [selectedFood, setSelectedFood] = useState<string[]>(['pasta']);
  const [foodNotes, setFoodNotes] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-11-20');
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<string>('sunset');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['cute_pics', 'watch_sunset']);
  const [personalNote, setPersonalNote] = useState<string>('');

  const totalSteps = 7; // Steps 0 to 6 are questions, Step 7 is Review & Submit

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: Partial<DateSubmission> = {
        invitationAnswerId,
        invitationAnswerLabel: invitationAnswerLabel || 'Yes 💗',
        dateType: selectedDateTypes,
        flowerColor: selectedFlowerColor,
        flowerType: selectedFlowerTypes,
        foodChoice: selectedFood,
        foodNotes,
        preferredDate,
        preferredTimeOfDay,
        activities: selectedActivities,
        personalNote
      };

      await api.submitDatePlan(payload);
      localStorage.setItem('malak_date_submitted', 'true');
      setSubmitted(true);

      // Huge celebration confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f43f6c', '#fe6d8f', '#ffa6b8', '#d4af37', '#ffd700']
      });
    } catch (err) {
      console.error('Failed to submit date plan:', err);
      alert('Could not submit right now, please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="paper-texture p-8 sm:p-12 rounded-3xl border-2 border-rose-300 shadow-2xl text-center animate-fade-in relative">
          <div className="washi-tape" style={{ top: '-14px' }} />

          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
          </div>

          <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2 block">
            It's Officially a Date!
          </span>

          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-rose-950 mb-4">
            Your Wish List is in My Hands ♡
          </h3>

          <p className="font-serif text-lg text-rose-800 leading-relaxed max-w-lg mx-auto mb-8 italic">
            "Your wish list is officially in my hands. Now let me make our date special. You just get ready to look as pretty as you always do."
          </p>

          {/* Quick summary of what was chosen */}
          <div className="bg-white/80 rounded-2xl p-6 border border-rose-200 text-left max-w-md mx-auto shadow-sm mb-6 space-y-3 text-sm text-rose-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span><strong>Date style:</strong> {selectedDateTypes.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-rose-500" />
              <span><strong>Flowers:</strong> {selectedFlowerColor} ({selectedFlowerTypes.join(', ')})</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-500" />
              <span><strong>Food:</strong> {selectedFood.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span><strong>Timing:</strong> {preferredDate} ({preferredTimeOfDay})</span>
            </div>
            {personalNote && (
              <div className="pt-2 border-t border-rose-100 text-xs italic text-rose-700">
                "{personalNote}"
              </div>
            )}
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-rose-500 hover:text-rose-700 underline font-medium"
          >
            Want to edit your choices? Click here
          </button>
        </div>
      </section>
    );
  }

  // Get question definitions
  const q1 = questions[0] || {
    options: [
      { id: "picnic", title: "A Picnic Date 🧺", description: "Just you, me, good food, cozy blanket, and a little piece of peace.", imageUrl: "/placeholders/date_picnic.jpg" },
      { id: "dinner", title: "Restaurant Dinner 🍝", description: "Good food, pretty lights, and sitting across from my favorite person.", imageUrl: "/placeholders/date_dinner.jpg" },
      { id: "clay", title: "A Clay Date 🎨", description: "Let's make something together, even if it turns out terrible and messy.", imageUrl: "/placeholders/date_clay.jpg" },
      { id: "cafe", title: "A Café Date ☕", description: "Coffee, warm conversations, pastries, and losing track of time.", imageUrl: "/placeholders/date_cafe.jpg" },
      { id: "movie", title: "A Movie Date 🎬", description: "A cozy film, popcorn, sweet snacks, and leaning on each other.", imageUrl: "/placeholders/date_movie.jpg" },
      { id: "surprise", title: "Surprise Me, Baby 🎁", description: "Let me plan every single detail for you from start to finish.", imageUrl: "/placeholders/date_surprise.jpg" }
    ]
  };

  const flowerColors = [
    { id: 'red_roses', title: 'Red roses ❤️', imageUrl: '/placeholders/flowers_red.jpg' },
    { id: 'pink_roses', title: 'Pink roses 🩷', imageUrl: '/placeholders/flowers_pink.jpg' },
    { id: 'white_flowers', title: 'White flowers 🤍', imageUrl: '/placeholders/flowers_white.jpg' },
    { id: 'purple_flowers', title: 'Purple flowers 💜', imageUrl: '/placeholders/flowers_purple.jpg' },
    { id: 'yellow_flowers', title: 'Yellow flowers 💛', imageUrl: '/placeholders/flowers_yellow.jpg' },
    { id: 'babys_breath', title: "Baby's breath 🌸", imageUrl: '/placeholders/flowers_babysbreath.jpg' },
    { id: 'mixed_bouquet', title: 'A colorful mixed bouquet 🌈', imageUrl: '/placeholders/flowers_mixed.jpg' },
    { id: 'surprise_flower', title: 'Surprise me! ✨', imageUrl: '/placeholders/flowers_surprise.jpg' }
  ];

  const flowerTypes = [
    { id: 'roses', title: 'Roses 🌹' },
    { id: 'tulips', title: 'Tulips 🌷' },
    { id: 'sunflowers', title: 'Sunflowers 🌻' },
    { id: 'lilies', title: 'Lilies 🌸' },
    { id: 'babys_breath_type', title: "Baby's breath 🌿" },
    { id: 'mixed_type', title: 'Mixed bouquet 💐' },
    { id: 'other_flowers', title: 'Other / Let me choose 🎀' }
  ];

  const foodOptions = [
    { id: 'pizza', title: 'Pizza 🍕' },
    { id: 'pasta', title: 'Pasta 🍝' },
    { id: 'burgers', title: 'Burgers 🍔' },
    { id: 'desserts_coffee', title: 'Desserts & coffee ☕🍰' },
    { id: 'ice_cream', title: 'Ice cream 🍦' },
    { id: 'full_dinner', title: 'Full restaurant dinner 🍽️' },
    { id: 'something_else', title: 'Something else 🤤' }
  ];

  const extraActivities = [
    { id: 'cute_pics', title: 'Take cute pictures 📸' },
    { id: 'make_scrapbook', title: 'Make a scrapbook together ✂️' },
    { id: 'clay_paint', title: 'Paint or make clay art 🎨' },
    { id: 'walk_beautiful', title: 'Walk somewhere scenic 🌿' },
    { id: 'watch_sunset', title: 'Watch the sunset 🌅' },
    { id: 'exchange_gifts', title: 'Exchange little surprise gifts 🎁' },
    { id: 'deep_talks', title: 'Have deep, uninterrupted talks 💬' },
    { id: 'you_choose', title: 'Something you choose for us ♡' }
  ];

  return (
    <section id="date-planner-section" className="py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 mb-3 text-rose-700 text-xs sm:text-sm font-medium">
          <Flower2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Interactive Date Planner</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
          Let's Plan Our Date 🌷
        </h2>
        <p className="text-rose-800/80 text-base max-w-md mx-auto">
          Tell me everything you're in the mood for, step by step!
        </p>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mt-6">
          <div className="flex justify-between text-xs font-medium text-rose-600 mb-2">
            <span>Step {currentStep + 1} of {totalSteps + 1}</span>
            <span>{Math.round(((currentStep + 1) / (totalSteps + 1)) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-rose-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* STEP CONTAINER */}
      <div className="paper-texture p-6 sm:p-10 rounded-3xl border border-rose-200/90 shadow-xl min-h-[460px] flex flex-col justify-between relative">
        <div className="washi-tape" style={{ top: '-12px' }} />

        {/* STEP 0: What kind of date? */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              1. What kind of date are you in the mood for?
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Pick your dream vibe (you can pick more than one!)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(q1.options || []).map(opt => {
                const isSelected = selectedDateTypes.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleArrayItem(setSelectedDateTypes, opt.id)}
                    className={`rounded-2xl p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-300'
                        : 'border-rose-200 bg-white hover:border-rose-300'
                    }`}
                  >
                    <div>
                      {opt.imageUrl && (
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-rose-100">
                          <img
                            src={opt.imageUrl}
                            alt={opt.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = '/placeholders/date_picnic.jpg';
                            }}
                          />
                        </div>
                      )}
                      <h4 className="font-serif font-bold text-rose-950 text-base mb-1">
                        {opt.title}
                      </h4>
                      {opt.description && (
                        <p className="text-xs text-rose-700 leading-relaxed font-sans">
                          {opt.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Flower Color */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              2. What color flowers do you want? 💐
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Pick the color that speaks to your heart
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {flowerColors.map(fc => {
                const isSelected = selectedFlowerColor === fc.id;
                return (
                  <div
                    key={fc.id}
                    onClick={() => setSelectedFlowerColor(fc.id)}
                    className={`rounded-2xl p-3 border cursor-pointer transition-all duration-300 text-center ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-300 scale-102'
                        : 'border-rose-200 bg-white hover:border-rose-300'
                    }`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-rose-100">
                      <img
                        src={fc.imageUrl}
                        alt={fc.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/placeholders/flowers_red.jpg';
                        }}
                      />
                    </div>
                    <span className="font-serif text-xs sm:text-sm font-semibold text-rose-950 block">
                      {fc.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Flower Types */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              3. What flowers do you like most?
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Choose your favorite blooms
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {flowerTypes.map(ft => {
                const isSelected = selectedFlowerTypes.includes(ft.id);
                return (
                  <button
                    key={ft.id}
                    onClick={() => toggleArrayItem(setSelectedFlowerTypes, ft.id)}
                    className={`p-4 rounded-2xl border font-serif text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300 shadow-sm'
                        : 'border-rose-200 bg-white text-rose-800 hover:border-rose-300'
                    }`}
                  >
                    <span>{ft.title}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Food cravings */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              4. What would you like to eat? 🍰
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Pick whatever you're craving right now
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto mb-6">
              {foodOptions.map(fo => {
                const isSelected = selectedFood.includes(fo.id);
                return (
                  <button
                    key={fo.id}
                    onClick={() => toggleArrayItem(setSelectedFood, fo.id)}
                    className={`p-3.5 rounded-2xl border font-serif text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300 shadow-sm'
                        : 'border-rose-200 bg-white text-rose-800 hover:border-rose-300'
                    }`}
                  >
                    <span>{fo.title}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="max-w-xl mx-auto">
              <label className="block text-xs font-medium text-rose-800 mb-1.5">
                Any specific allergies, cravings, or favorite restaurant in mind?
              </label>
              <input
                type="text"
                value={foodNotes}
                onChange={e => setFoodNotes(e.target.value)}
                placeholder="e.g. Extra iced matcha latte, no peanuts, cute dessert cafe..."
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-sm text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Date & Time */}
        {currentStep === 4 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              5. When should our date be?
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Pick a date or let's be flexible
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-rose-800 mb-1.5">
                  Pick a preferred date:
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 font-serif text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-800 mb-1.5">
                  Preferred time of day:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'afternoon', label: 'Afternoon ☀️' },
                    { id: 'sunset', label: 'Sunset 🌅' },
                    { id: 'evening', label: 'Evening 🌙' },
                    { id: 'flexible', label: "I'm flexible! 💖" }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPreferredTimeOfDay(t.id)}
                      className={`p-3 rounded-xl border font-serif text-xs sm:text-sm font-semibold transition-all ${
                        preferredTimeOfDay === t.id
                          ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300'
                          : 'border-rose-200 bg-white text-rose-800 hover:border-rose-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: What should we do together? */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              6. What should we do together? 💕
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-8">
              Choose any extra activities you want us to do
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {extraActivities.map(act => {
                const isSelected = selectedActivities.includes(act.id);
                return (
                  <button
                    key={act.id}
                    onClick={() => toggleArrayItem(setSelectedActivities, act.id)}
                    className={`p-3.5 rounded-2xl border font-serif text-sm font-semibold transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300 shadow-sm'
                        : 'border-rose-200 bg-white text-rose-800 hover:border-rose-300'
                    }`}
                  >
                    <span>{act.title}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ml-2 ${
                      isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Note for me */}
        {currentStep === 6 && (
          <div className="animate-fade-in max-w-xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2 text-center">
              7. A little note for me 💌
            </h3>
            <p className="text-rose-700/80 text-sm text-center mb-6">
              Is there anything else you'd love for our date?
            </p>

            <textarea
              rows={5}
              value={personalNote}
              onChange={e => setPersonalNote(e.target.value)}
              placeholder="Tell me any sweet requests, secret wishes, songs you want to listen to, or anything else..."
              className="w-full p-4 rounded-2xl border border-rose-200 bg-white text-rose-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-sans shadow-inner"
            />
          </div>
        )}

        {/* STEP 7: Summary & Send */}
        {currentStep === 7 && (
          <div className="animate-fade-in max-w-xl mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
              Your Perfect Date Summary
            </h3>
            <p className="text-rose-700/80 text-sm mb-6">
              Review everything before sending it straight to me!
            </p>

            <div className="bg-white/90 rounded-2xl p-6 border border-rose-200 text-left space-y-3.5 text-sm text-rose-900 shadow-sm mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Date Type</span>
                <span className="font-serif font-bold text-base">{selectedDateTypes.join(', ')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Flower Color</span>
                  <span>{selectedFlowerColor}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Flower Types</span>
                  <span>{selectedFlowerTypes.join(', ')}</span>
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Food & Drinks</span>
                <span>{selectedFood.join(', ')} {foodNotes ? `(${foodNotes})` : ''}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Timing</span>
                <span>{preferredDate} • {preferredTimeOfDay}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Activities</span>
                <span>{selectedActivities.join(', ')}</span>
              </div>
              {personalNote && (
                <div className="pt-2 border-t border-rose-100">
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 block">Your Note</span>
                  <p className="text-xs italic text-rose-800">"{personalNote}"</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white font-serif text-lg font-bold shadow-lg shadow-rose-600/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 text-rose-200" />
              <span>{isSubmitting ? 'Sending to your love...' : 'Send my dream date to you 💗'}</span>
            </button>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-rose-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-rose-700 ${
              currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-rose-100 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < 7 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95"
            >
              <span>{currentStep === 6 ? 'Review My Dream Date' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
