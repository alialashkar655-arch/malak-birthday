import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onToggleFavorite
}) => {
  const currentItem = items[currentIndex];
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !currentItem) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery photo preview"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-white/90 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full font-medium">
            {currentItem.category}
          </span>
          <span className="text-xs text-white/60">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(currentItem)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
            title="Mark as favorite"
          >
            <Heart className={`w-5 h-5 ${currentItem.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Media Container */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Nav arrows */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Previous (Left arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="max-h-[75vh] max-w-[90vw] flex items-center justify-center">
          {currentItem.mediaType === 'video' ? (
            <video
              src={currentItem.mediaUrl}
              controls
              autoPlay
              className="max-h-[75vh] max-w-full rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={currentItem.mediaUrl}
              alt={currentItem.title}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = '/placeholders/gallery_1.jpg';
              }}
            />
          )}
        </div>

        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Next (Right arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="max-w-2xl mx-auto w-full text-center text-white z-10 pb-2">
        <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1">
          {currentItem.title}
        </h3>
        {currentItem.caption && (
          <p className="text-white/80 text-sm font-sans max-w-lg mx-auto">
            {currentItem.caption}
          </p>
        )}
        {currentItem.date && (
          <div className="inline-flex items-center gap-1 text-xs text-white/50 mt-1">
            <Calendar className="w-3 h-3" />
            <span>{currentItem.date}</span>
          </div>
        )}
      </div>
    </div>
  );
};
