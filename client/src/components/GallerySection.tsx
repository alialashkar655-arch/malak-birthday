import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Heart, Sparkles, Film, Image as ImageIcon, Camera } from 'lucide-react';
import { api } from '../services/api';

interface GallerySectionProps {
  items: GalleryItem[];
  onOpenLightbox: (index: number) => void;
  onItemUpdated?: (updated: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  onOpenLightbox,
  onItemUpdated
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [localItems, setLocalItems] = useState<GalleryItem[]>(items);

  // Keep synced with props
  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const categories = ['All', 'Our Pictures', 'Her Pictures', 'Dates', 'Random Moments', 'Videos'];

  const filteredItems = activeCategory === 'All'
    ? localItems
    : localItems.filter(item => item.category === activeCategory);

  const handleFavoriteToggle = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    try {
      const res = await api.toggleFavorite(item.id);
      const updated = { ...item, isFavorite: res.isFavorite };
      setLocalItems(prev => prev.map(i => i.id === item.id ? updated : i));
      if (onItemUpdated) {
        onItemUpdated(updated);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <section id="gallery-section" className="py-24 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 mb-4 text-rose-700 text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Photo & Video Journal</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-rose-950 mb-4 tracking-tight">
          Little Moments, Big Feelings ♡
        </h2>
        <p className="text-rose-800/80 text-base sm:text-lg max-w-xl mx-auto mb-8 font-sans">
          A Pinterest-style board of our sweetest adventures, silly candids, and quiet moments.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-105'
                  : 'bg-white/80 border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry / Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-rose-200">
          <Camera className="w-10 h-10 text-rose-300 mx-auto mb-2" />
          <p className="text-rose-700 font-serif text-lg">No moments found in this category yet</p>
          <p className="text-rose-500 text-xs mt-1">Add them via the Admin panel to fill your gallery!</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => {
            const globalIndex = items.findIndex(i => i.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(globalIndex >= 0 ? globalIndex : 0)}
                className="break-inside-avoid group cursor-pointer"
              >
                <div className="paper-texture rounded-2xl overflow-hidden border border-rose-200/80 shadow-scrapbook hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5 relative">
                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => handleFavoriteToggle(e, item)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-rose-200/80 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-90 transition-all shadow-sm"
                    title={item.isFavorite ? "Favorited ♡" : "Mark as favorite"}
                  >
                    <Heart
                      className={`w-4 h-4 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`}
                    />
                  </button>

                  {/* Media Content */}
                  <div className="relative overflow-hidden bg-rose-50">
                    {item.mediaType === 'video' ? (
                      <div className="relative aspect-video bg-black flex items-center justify-center">
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          preload="none"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Film className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/placeholders/gallery_1.jpg';
                        }}
                      />
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Card Info */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-rose-500 font-medium mb-1.5">
                      <span className="uppercase tracking-wider">{item.category}</span>
                      {item.date && <span>{item.date}</span>}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-rose-950 group-hover:text-rose-600 transition-colors mb-1.5">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-rose-800/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
