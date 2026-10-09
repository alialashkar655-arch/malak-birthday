import React, { useState } from 'react';
import { PhotobookData } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, RotateCcw, Printer, Sparkles, Heart } from 'lucide-react';

interface PhotoBookSectionProps {
  photobook: PhotobookData;
  recipientName: string;
}

export const PhotoBookSection: React.FC<PhotoBookSectionProps> = ({ photobook, recipientName }) => {
  // Page 0 = Front Cover
  // Page 1 = Secret First Page ("Every little moment led me to you")
  // Page 2..N = Scrapbook Pages
  // Page N+1 = Back Cover Love Letter
  const [currentPage, setCurrentPage] = useState<number>(0);

  const totalPages = photobook.pages.length + 2; // cover (0), secret (1), pages (2..N+1), back cover (N+2)
  const maxPageIndex = photobook.pages.length + 1;

  const handleNext = () => {
    if (currentPage < maxPageIndex + 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentPage(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderSticker = (sticker?: string) => {
    switch (sticker) {
      case 'heart':
        return <span className="text-rose-500 font-serif text-xl">❤️</span>;
      case 'flower':
        return <span className="text-pink-400 font-serif text-xl">🌸</span>;
      case 'stamp':
        return <span className="text-[10px] uppercase tracking-widest text-rose-800 border border-rose-300 px-2 py-0.5 rounded bg-rose-50 font-serif">PASSPORT</span>;
      case 'tape':
        return <div className="washi-tape" style={{ position: 'relative', top: '0', margin: '0 auto 8px auto' }} />;
      default:
        return <span className="text-amber-400 font-serif text-xl">✨</span>;
    }
  };

  return (
    <section id="photobook-section" className="py-24 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 mb-4 text-rose-700 text-xs sm:text-sm font-medium">
          <BookOpen className="w-3.5 h-3.5 text-rose-500" />
          <span>Interactive Keepsake Album</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
          A Little Book of Us ♡
        </h2>
        <p className="text-rose-800/80 text-base sm:text-lg max-w-xl mx-auto mb-6">
          {photobook.coverSubtitle || "My favorite memories with my favorite person."}
        </p>

        {/* Action toolbar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-rose-200 text-xs text-rose-700 font-medium hover:bg-rose-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Beginning</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-rose-200 text-xs text-rose-700 font-medium hover:bg-rose-50 transition-colors shadow-sm"
            title="Print or export album to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-rose-500" />
            <span>Print Keepsake / PDF</span>
          </button>
        </div>
      </div>

      {/* The Book Container */}
      <div className="relative max-w-2xl mx-auto">
        {/* Book Binding Spine effect */}
        <div className="paper-texture rounded-3xl border-2 border-rose-200/90 shadow-2xl overflow-hidden min-h-[520px] sm:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 relative transition-all duration-500">
          {/* Subtle corner tabs */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-rose-300 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-rose-300 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-rose-300 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-rose-300 rounded-br-2xl pointer-events-none" />

          {/* PAGE CONTENT */}
          <div className="flex-1 flex flex-col justify-center my-auto">
            {/* Page 0: FRONT COVER */}
            {currentPage === 0 && (
              <div className="text-center py-6 animate-fade-in flex flex-col items-center">
                <div className="washi-tape" style={{ top: '-10px' }} />

                <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold mb-2">
                  Vol. 1 • Keepsake Edition
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950 mb-3 tracking-tight">
                  {photobook.coverTitle || "A Little Book of Us"}
                </h3>

                <p className="font-handwriting text-2xl text-rose-700 mb-6">
                  {photobook.coverSubtitle || `My favorite memories with ${recipientName}`}
                </p>

                {/* Cover Photo */}
                <div className="polaroid-frame max-w-xs w-full mx-auto mb-6">
                  <div className="aspect-[4/3] rounded overflow-hidden bg-rose-50 border border-rose-100">
                    <img
                      src={photobook.coverPhotoUrl || "/placeholders/book_cover.jpg"}
                      alt="Album Cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholders/book_cover.jpg';
                      }}
                    />
                  </div>
                  <p className="font-handwriting text-2xl text-rose-900 text-center mt-3 select-none">
                    "Every little moment with you." ♡
                  </p>
                </div>

                <p className="text-xs text-rose-400 font-sans">
                  Tap 'Next' or the arrow to turn the page ➔
                </p>
              </div>
            )}

            {/* Page 1: SECRET FIRST PAGE */}
            {currentPage === 1 && (
              <div className="text-center py-12 px-4 animate-fade-in flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>

                <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-4">
                  Chapter Zero
                </span>

                <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-rose-950 leading-relaxed max-w-md mx-auto mb-8 italic">
                  "{photobook.secretPageQuote || "Every little moment led me to you."}"
                </blockquote>

                <div className="w-24 h-0.5 bg-rose-300 mx-auto mb-8" />

                <p className="font-handwriting text-2xl text-rose-800 max-w-sm mx-auto leading-relaxed">
                  Turn the page to see our real memories, laughter, and adventures together.
                </p>
              </div>
            )}

            {/* Pages 2..N+1: PHOTO PAGES */}
            {currentPage >= 2 && currentPage <= photobook.pages.length + 1 && (() => {
              const page = photobook.pages[currentPage - 2];
              if (!page) return null;

              return (
                <div className="animate-fade-in py-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-rose-600 font-semibold">
                      {page.date || `Memory #${page.pageNumber}`}
                    </span>
                    {renderSticker(page.sticker)}
                  </div>

                  {/* Photo Display */}
                  <div className="polaroid-frame max-w-md mx-auto mb-5">
                    <div className="aspect-[4/3] rounded overflow-hidden bg-rose-50 border border-rose-100">
                      <img
                        src={page.mediaUrl}
                        alt={page.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/placeholders/book_page${((currentPage - 2) % 4) + 1}.jpg`;
                        }}
                      />
                    </div>

                    {page.handwrittenNote && (
                      <p className="font-handwriting text-2xl text-rose-800 text-center mt-3 select-none">
                        {page.handwrittenNote}
                      </p>
                    )}
                  </div>

                  {/* Title and Caption */}
                  <div className="text-center max-w-md mx-auto">
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-rose-950 mb-2">
                      {page.title}
                    </h4>
                    {page.caption && (
                      <p className="text-rose-900/90 text-sm sm:text-base leading-relaxed font-sans">
                        {page.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Last Page: BACK COVER LOVE LETTER */}
            {currentPage === maxPageIndex + 1 && (
              <div className="text-center py-8 px-4 animate-fade-in flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
                </div>

                <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">
                  Back Cover • Love Note
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-4">
                  {photobook.backCoverLetterTitle || "Forever Grateful for You"}
                </h3>

                <div className="bg-white/90 border border-rose-200 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-sm mb-6 text-left">
                  <p className="font-serif text-rose-950 text-base leading-relaxed whitespace-pre-line">
                    {photobook.backCoverLetter || `This little album is only a fraction of everything I cherish about us. Thank you for being my peace, my biggest smile, and my favorite adventure. Happy Birthday, ${recipientName}. ♡`}
                  </p>
                </div>

                <p className="font-handwriting text-2xl text-rose-800">
                  "To endless more pages of you and me." ♡
                </p>
              </div>
            )}
          </div>

          {/* Book Navigation Footer */}
          <div className="pt-6 border-t border-rose-100 flex items-center justify-between text-xs sm:text-sm text-rose-700">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-all ${
                currentPage === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-rose-100/70 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page indicator */}
            <div className="flex items-center gap-2">
              <span className="font-serif text-rose-900 font-semibold">
                {currentPage === 0
                  ? 'Cover'
                  : currentPage === 1
                  ? 'Intro'
                  : currentPage === maxPageIndex + 1
                  ? 'Back Cover'
                  : `Page ${currentPage - 1} of ${photobook.pages.length}`}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === maxPageIndex + 1}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-all ${
                currentPage === maxPageIndex + 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-rose-100/70 active:scale-95'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
