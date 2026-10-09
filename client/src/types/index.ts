export interface SiteSettings {
  recipientName: string;
  partnerName: string;
  birthdayDate: string;
  timezone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  heroButtonText: string;
  heroPhotoUrl: string;
  favoritePhoto: {
    imageUrl: string;
    caption: string;
    handwrittenNote: string;
    date: string;
    location: string;
  };
  birthdayMessage: {
    heading: string;
    subheading: string;
    letter: string;
    videoUrl: string;
    audioUrl: string;
    voiceNoteUrl?: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    fontSerif: string;
    fontSans: string;
    fontHandwriting: string;
  };
  sectionVisibility: {
    hero: boolean;
    story: boolean;
    gallery: boolean;
    favoritePhoto: boolean;
    photobook: boolean;
    dateInvitation: boolean;
    datePlanner: boolean;
    loveLetters: boolean;
    birthdayCountdown: boolean;
    reasonsCounter: boolean;
    audioPlayer: boolean;
  };
  visitorPasscode?: string;
  isPublicSite: boolean;
}

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  handwrittenNote?: string;
  sticker?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  date?: string;
  category: 'Our Pictures' | 'Her Pictures' | 'Dates' | 'Random Moments' | 'Videos';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isFavorite: boolean;
  order: number;
}

export interface PhotobookPage {
  id: string;
  pageNumber: number;
  title: string;
  caption: string;
  date?: string;
  mediaUrl: string;
  handwrittenNote?: string;
  sticker?: 'heart' | 'tape' | 'flower' | 'stamp' | 'sparkle' | 'stars';
  layout: 'polaroid' | 'classic' | 'journal' | 'full';
}

export interface PhotobookData {
  coverTitle: string;
  coverSubtitle: string;
  coverPhotoUrl: string;
  secretPageQuote: string;
  backCoverLetterTitle: string;
  backCoverLetter: string;
  pages: PhotobookPage[];
}

export interface OpenWhenNote {
  id: string;
  title: string;
  category: string;
  icon: string;
  content: string;
  revealPhotoUrl?: string;
}

export interface LoveLettersData {
  mainLetter: {
    title: string;
    date: string;
    content: string;
    polaroidUrl: string;
    polaroidCaption: string;
    signOff: string;
  };
  openWhenNotes: OpenWhenNote[];
}

export interface DateInvitationChoice {
  id: string;
  label: string;
  response: string;
  animationEmoji: string;
}

export interface DateInvitationData {
  heading: string;
  question: string;
  subtitle: string;
  choices: DateInvitationChoice[];
}

export interface DateQuestionOption {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  emoji?: string;
}

export interface DateQuestion {
  id: string;
  stepNumber: number;
  question: string;
  subtitle?: string;
  type: 'single' | 'multiple' | 'datetime' | 'text';
  options?: DateQuestionOption[];
  placeholder?: string;
}

export interface DateSubmission {
  id: string;
  submittedAt: string;
  invitationAnswerId: string;
  invitationAnswerLabel: string;
  dateType: string[];
  flowerColor: string;
  flowerType: string[];
  foodChoice: string[];
  foodNotes?: string;
  preferredDate?: string;
  preferredTimeOfDay?: string;
  activities: string[];
  personalNote?: string;
  status: 'new' | 'planned' | 'archived';
}
