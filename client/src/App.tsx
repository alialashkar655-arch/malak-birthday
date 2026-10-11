import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  TimelineEntry,
  GalleryItem,
  PhotobookData,
  LoveLettersData,
  DateInvitationData,
  DateQuestion
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroEnvelope } from './components/HeroEnvelope';
import { BirthdayCountdown } from './components/BirthdayCountdown';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { FavoritePictureSection } from './components/FavoritePictureSection';
import { PhotoBookSection } from './components/PhotoBookSection';
import { DateInvitationSection } from './components/DateInvitationSection';
import { DatePlanner } from './components/DatePlannerModal';
import { LoveLettersSection } from './components/LoveLettersSection';
import { ReasonsCounterSection } from './components/ReasonsCounterSection';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { CustomCursor } from './components/CustomCursor';
import { FloatingHeartsButton } from './components/FloatingHeartsButton';
import { LightboxModal } from './components/LightboxModal';
import { AdminModal } from './components/AdminModal';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

import {
  fallbackSettings,
  fallbackTimeline,
  fallbackGallery,
  fallbackPhotobook,
  fallbackLoveLetters,
  fallbackDateInvitation,
  fallbackDateQuestions,
  fallbackCompliments,
  fallbackReasons
} from './data/fallbackData';

export function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [photobook, setPhotobook] = useState<PhotobookData | null>(null);
  const [loveLetters, setLoveLetters] = useState<LoveLettersData | null>(null);
  const [dateInvitation, setDateInvitation] = useState<DateInvitationData | null>(null);
  const [dateQuestions, setDateQuestions] = useState<DateQuestion[]>([]);
  const [compliments, setCompliments] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);

  // Modals & UI Controls
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [previewBirthdayMode, setPreviewBirthdayMode] = useState<boolean>(false);

  // Accepted Date state
  const [invitationChoice, setInvitationChoice] = useState<{ id: string; label: string }>({
    id: 'yes',
    label: 'Yes 💗'
  });

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        sData,
        tData,
        gData,
        pData,
        lData,
        diData,
        dqData,
        cData,
        rData
      ] = await Promise.all([
        api.getSettings(),
        api.getTimeline(),
        api.getGallery(),
        api.getPhotobook(),
        api.getLetters(),
        api.getDateInvitation(),
        api.getDateQuestions(),
        api.getCompliments(),
        api.getReasons()
      ]);

      setSettings(sData);
      setTimeline(tData);
      setGallery(gData);
      setPhotobook(pData);
      setLoveLetters(lData);
      setDateInvitation(diData);
      setDateQuestions(dqData);
      setCompliments(cData);
      setReasons(rData);
    } catch (err: any) {
      console.warn('Backend server currently unavailable, using romantic seed data:', err);
      // Fallback gracefully so Malak never sees an error screen!
      setSettings(fallbackSettings);
      setTimeline(fallbackTimeline);
      setGallery(fallbackGallery);
      setPhotobook(fallbackPhotobook);
      setLoveLetters(fallbackLoveLetters);
      setDateInvitation(fallbackDateInvitation);
      setDateQuestions(fallbackDateQuestions);
      setCompliments(fallbackCompliments);
      setReasons(fallbackReasons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleLightboxFromTimeline = (mediaUrl: string, title: string, caption: string, isVideo: boolean) => {
    // Look up if exists in gallery or make temporary item
    const existingIndex = gallery.findIndex(g => g.mediaUrl === mediaUrl);
    if (existingIndex >= 0) {
      handleOpenLightbox(existingIndex);
    } else {
      // Append temporary view item
      setGallery(prev => [
        ...prev,
        {
          id: 'temp-view',
          title,
          caption,
          mediaUrl,
          mediaType: isVideo ? 'video' : 'image',
          category: 'Our Pictures',
          isFavorite: false,
          order: prev.length + 1
        }
      ]);
      setLightboxIndex(gallery.length);
      setIsLightboxOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf5f3] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
          <Heart className="w-8 h-8 fill-rose-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-rose-950 mb-2">
          Opening Our Little Universe... ♡
        </h2>
        <p className="text-rose-600 text-xs font-handwriting text-lg animate-pulse">
          Gathering memories, love letters, and surprises
        </p>
      </div>
    );
  }

  if (error || !settings || !photobook || !loveLetters || !dateInvitation) {
    return (
      <div className="min-h-screen bg-[#faf5f3] flex flex-col items-center justify-center p-4 text-center">
        <div className="paper-texture p-8 rounded-3xl border border-rose-300 max-w-md shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-rose-950 mb-2">
            Connecting to Server
          </h2>
          <p className="text-xs text-rose-700 mb-6">
            {error || 'Initializing settings...'}
          </p>
          <button
            onClick={loadAllData}
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {/* Desktop Custom Sparkling Cursor */}
      <CustomCursor />

      {/* Floating Ambient Music Player */}
      {settings.sectionVisibility?.audioPlayer !== false && (
        <AudioPlayer customAudioUrl={settings.birthdayMessage?.audioUrl?.trim() || '/our_song.mp3'} />
      )}

      {/* Floating Quick Heart Burst Button & Easter Egg */}
      <FloatingHeartsButton recipientName={settings.recipientName} />

      {/* Navigation Bar */}
      <Navbar
        recipientName={settings.recipientName}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* SECTION 1: Opening Screen / Envelope Experience */}
        {settings.sectionVisibility?.hero !== false && (
          <HeroEnvelope
            settings={settings}
            onOpenExperience={() => {
              // Smooth scroll to story
            }}
          />
        )}

        {/* SECTION 2: Birthday Countdown & November 20 Celebration */}
        {settings.sectionVisibility?.birthdayCountdown !== false && (
          <BirthdayCountdown
            settings={settings}
            previewBirthdayMode={previewBirthdayMode}
          />
        )}

        {/* SECTION 3: Our Story — Timeline of Memories */}
        {settings.sectionVisibility?.story !== false && (
          <TimelineSection
            entries={timeline}
            onOpenLightbox={handleLightboxFromTimeline}
          />
        )}

        {/* SECTION 4: Our Memories — Photos and Videos (Pinterest Masonry) */}
        {settings.sectionVisibility?.gallery !== false && (
          <GallerySection
            items={gallery}
            onOpenLightbox={handleOpenLightbox}
            onItemUpdated={(updated) => {
              setGallery(prev => prev.map(i => i.id === updated.id ? updated : i));
            }}
          />
        )}

        {/* SECTION 5: "My Favorite Picture of You 🥹" Spotlight */}
        {settings.sectionVisibility?.favoritePhoto !== false && (
          <FavoritePictureSection
            settings={settings}
            compliments={compliments}
          />
        )}

        {/* SECTION 6: The Digital Scrapbook Photo Book — "A Little Book of Us" */}
        {settings.sectionVisibility?.photobook !== false && (
          <PhotoBookSection
            photobook={photobook}
            recipientName={settings.recipientName}
          />
        )}

        {/* SECTION 7: The Surprise Date Invitation */}
        {settings.sectionVisibility?.dateInvitation !== false && (
          <DateInvitationSection
            data={dateInvitation}
            recipientName={settings.recipientName}
            onAccepted={(id, label) => {
              setInvitationChoice({ id, label });
              // Scroll smoothly to planner
              setTimeout(() => {
                const el = document.getElementById('date-planner-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 400);
            }}
          />
        )}

        {/* SECTION 8: Interactive Multi-Step Date Planner */}
        {settings.sectionVisibility?.datePlanner !== false && (
          <DatePlanner
            questions={dateQuestions}
            recipientName={settings.recipientName}
            invitationAnswerId={invitationChoice.id}
            invitationAnswerLabel={invitationChoice.label}
          />
        )}

        {/* SECTION 9: Love Letter Just for Her & "Open When..." */}
        {settings.sectionVisibility?.loveLetters !== false && (
          <LoveLettersSection
            data={loveLetters}
            recipientName={settings.recipientName}
          />
        )}

        {/* SECTION 10: Reasons I Love You Counter */}
        {settings.sectionVisibility?.reasonsCounter !== false && reasons.length > 0 && (
          <ReasonsCounterSection
            reasons={reasons}
            recipientName={settings.recipientName}
          />
        )}
      </main>

      {/* Romantic Footer */}
      <Footer
        recipientName={settings.recipientName}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        items={gallery}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => setLightboxIndex(prev => (prev + 1) % gallery.length)}
        onPrev={() => setLightboxIndex(prev => (prev - 1 + gallery.length) % gallery.length)}
        onToggleFavorite={async (item) => {
          if (!item.id || item.id.startsWith('temp-')) {
            setGallery(prev => prev.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i));
            return;
          }
          try {
            const res = await api.toggleFavorite(item.id);
            setGallery(prev => prev.map(i => i.id === item.id ? { ...i, isFavorite: res.isFavorite } : i));
          } catch (e) {
            console.error(e);
            setGallery(prev => prev.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i));
          }
        }}
      />

      {/* Admin CMS Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        timeline={timeline}
        gallery={gallery}
        photobook={photobook}
        loveLetters={loveLetters}
        dateInvitation={dateInvitation}
        dateQuestions={dateQuestions}
        compliments={compliments}
        reasons={reasons}
        onRefreshAll={loadAllData}
        previewBirthdayMode={previewBirthdayMode}
        onToggleBirthdayPreview={() => setPreviewBirthdayMode(!previewBirthdayMode)}
      />
    </div>
  );
}

export default App;
