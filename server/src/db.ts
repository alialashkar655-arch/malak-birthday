import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { DatabaseSchema, SiteSettings } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Simple secure password hashing using Node crypto scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// Initial romantic seed data designed specifically for Malak
const DEFAULT_PASSWORD = 'malak2026'; // Default admin password, can be changed in settings/admin

const initialData: DatabaseSchema = {
  settings: {
    recipientName: "Malak",
    partnerName: "Your Love",
    birthdayDate: "2026-11-20",
    timezone: "Africa/Cairo",
    heroTitle: "For Malak, my favorite person ♡",
    heroSubtitle: "A little something, just for you.",
    heroIntro: "Every memory with you is my favorite place to be. I made this little universe just to remind you how deeply loved, cherished, and irreplaceable you are.",
    heroButtonText: "Open your little world 💌",
    heroPhotoUrl: "/placeholders/hero_together.jpg",
    favoritePhoto: {
      imageUrl: "/placeholders/favorite_portrait.jpg",
      caption: "You were laughing so freely, and in that exact second I felt like the luckiest person in the whole world. That genuine smile of yours lights up everything around you.",
      handwrittenNote: "My favorite view in every single lifetime. ♡",
      date: "October 2026",
      location: "Our favorite spot"
    },
    birthdayMessage: {
      heading: "Happy Birthday, My Beautiful Malak! 🎉🎂❤️",
      subheading: "Today the world is celebrating the absolute sweetest soul in it.",
      letter: "To my favorite person in the entire world — Happy Birthday! Looking back at all our memories, I'm so grateful for every laugh, every quiet moment, and every adventure we've shared. May this year bring you all the warmth, joy, and dreams you truly deserve. I love you more than words could ever describe.",
      videoUrl: "",
      audioUrl: "",
      voiceNoteUrl: ""
    },
    theme: {
      primaryColor: "#bd5366",
      accentColor: "#f43f6c",
      bgColor: "#faf5f3",
      fontSerif: "Playfair Display",
      fontSans: "Plus Jakarta Sans",
      fontHandwriting: "Caveat"
    },
    sectionVisibility: {
      hero: true,
      story: true,
      gallery: true,
      favoritePhoto: true,
      photobook: true,
      dateInvitation: true,
      datePlanner: true,
      loveLetters: true,
      birthdayCountdown: true,
      reasonsCounter: true,
      audioPlayer: true
    },
    adminPasswordHash: hashPassword(DEFAULT_PASSWORD),
    visitorPasscode: "", // Blank means visitor can view without passcode
    isPublicSite: true
  },
  timeline: [
    {
      id: "tl-1",
      title: "When We First Met",
      date: "The Day Everything Changed",
      caption: "I still remember the feeling when I first saw you. I had no idea that moment was the beginning of my favorite story.",
      mediaUrl: "/placeholders/timeline_1.jpg",
      mediaType: "image",
      handwrittenNote: "Where it all started... ✨",
      sticker: "heart",
      order: 1
    },
    {
      id: "tl-2",
      title: "Our First Picture Together",
      date: "Our First Selfie",
      caption: "We were both a little shy, trying to pose normally, but neither of us could stop smiling.",
      mediaUrl: "/placeholders/timeline_2.jpg",
      mediaType: "image",
      handwrittenNote: "Look how cute we were! ♡",
      sticker: "tape",
      order: 2
    },
    {
      id: "tl-3",
      title: "Our Funniest Memory",
      date: "A Day Full of Laughter",
      caption: "We couldn't stop laughing until our stomachs hurt. Those chaotic, silly moments with you are my absolute favorite.",
      mediaUrl: "/placeholders/timeline_3.jpg",
      mediaType: "image",
      handwrittenNote: "My stomach hurt from laughing 😂",
      sticker: "star",
      order: 3
    },
    {
      id: "tl-4",
      title: "Our Favorite Date",
      date: "The Perfect Day",
      caption: "Good food, endless conversations, holding hands, and wishing time would just freeze so we wouldn't have to say goodbye.",
      mediaUrl: "/placeholders/timeline_4.jpg",
      mediaType: "image",
      handwrittenNote: "Never wanted this day to end ☕",
      sticker: "flower",
      order: 4
    },
    {
      id: "tl-5",
      title: "A Moment I Never Want to Forget",
      date: "Pure Magic",
      caption: "That quiet evening when we sat together, watching the colors in the sky fade, and realizing you've become home to me.",
      mediaUrl: "/placeholders/timeline_5.jpg",
      mediaType: "image",
      handwrittenNote: "Saved in my heart forever 🌙",
      sticker: "stamp",
      order: 5
    },
    {
      id: "tl-6",
      title: "Our Most Recent Memory",
      date: "Just Recently",
      caption: "Every day with you still feels like a blessing. Even the simplest moments feel like a warm hug when you're by my side.",
      mediaUrl: "/placeholders/timeline_6.jpg",
      mediaType: "image",
      handwrittenNote: "Still falling for you every day 🌸",
      sticker: "heart",
      order: 6
    },
    {
      id: "tl-7",
      title: "A Future Memory We Have Yet to Make",
      date: "All Our Tomorrows",
      caption: "All the trips we'll take, the sunsets we'll chase, the dates we'll plan, and all the quiet ordinary days waiting for us.",
      mediaUrl: "/placeholders/timeline_7.jpg",
      mediaType: "image",
      handwrittenNote: "To a lifetime of us ♡",
      sticker: "sparkle",
      order: 7
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Golden Hour Glow",
      caption: "The golden sunset looked pretty, but honestly, you outshone it completely.",
      date: "Golden Sunset",
      category: "Her Pictures",
      mediaUrl: "/placeholders/gallery_1.jpg",
      mediaType: "image",
      isFavorite: true,
      order: 1
    },
    {
      id: "gal-2",
      title: "Coffee & Cozy Talks",
      caption: "Sitting across from you with iced lattes and never running out of things to say.",
      date: "Café Date",
      category: "Dates",
      mediaUrl: "/placeholders/gallery_2.jpg",
      mediaType: "image",
      isFavorite: false,
      order: 2
    },
    {
      id: "gal-3",
      title: "Hand in Hand",
      caption: "Walking beside you, my favorite hand to hold.",
      date: "Evening Walk",
      category: "Our Pictures",
      mediaUrl: "/placeholders/gallery_3.jpg",
      mediaType: "image",
      isFavorite: true,
      order: 3
    },
    {
      id: "gal-4",
      title: "Spontaneous Laughter",
      caption: "Mid-laugh candid that proves you have the most infectious joy.",
      date: "Spontaneous Day",
      category: "Random Moments",
      mediaUrl: "/placeholders/gallery_4.jpg",
      mediaType: "image",
      isFavorite: false,
      order: 4
    },
    {
      id: "gal-5",
      title: "Picnic Afternoon",
      caption: "Fresh flowers, strawberries, breeze, and your smile.",
      date: "Sunny Picnic",
      category: "Dates",
      mediaUrl: "/placeholders/gallery_5.jpg",
      mediaType: "image",
      isFavorite: true,
      order: 5
    },
    {
      id: "gal-6",
      title: "Sweet Little Video Clip",
      caption: "A short clip capturing a little glimpse of your laughter.",
      date: "Memory Clip",
      category: "Videos",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      mediaType: "video",
      isFavorite: false,
      order: 6
    }
  ],
  photobook: {
    coverTitle: "A Little Book of Us",
    coverSubtitle: "My favorite memories with my favorite person.",
    coverPhotoUrl: "/placeholders/book_cover.jpg",
    secretPageQuote: "Every little moment led me to you.",
    backCoverLetterTitle: "Forever Grateful for You",
    backCoverLetter: "This little album is only a fraction of everything I cherish about us. Thank you for being my peace, my biggest smile, and my favorite adventure. Happy Birthday, Malak. ♡",
    pages: [
      {
        id: "page-1",
        pageNumber: 1,
        title: "Chapter One: The Spark",
        caption: "Who knew that one small conversation would turn into the best thing that ever happened to me?",
        date: "First Hello",
        mediaUrl: "/placeholders/book_page1.jpg",
        handwrittenNote: "The exact moment the universe got it right.",
        sticker: "heart",
        layout: "polaroid"
      },
      {
        id: "page-2",
        pageNumber: 2,
        title: "Late Night Conversations",
        caption: "Talking until 2 AM about anything and everything, losing all track of time.",
        date: "Endless Calls",
        mediaUrl: "/placeholders/book_page2.jpg",
        handwrittenNote: "My favorite voice to fall asleep to.",
        sticker: "tape",
        layout: "classic"
      },
      {
        id: "page-3",
        pageNumber: 3,
        title: "Sunny Afternoons",
        caption: "Walking nowhere in particular, just happy to be by each other's side.",
        date: "Sunny Days",
        mediaUrl: "/placeholders/book_page3.jpg",
        handwrittenNote: "Sunshine always looks better on you.",
        sticker: "flower",
        layout: "journal"
      },
      {
        id: "page-4",
        pageNumber: 4,
        title: "The Quiet Moments",
        caption: "Not even needing to say a word to feel completely comfortable and at home.",
        date: "Soft Peace",
        mediaUrl: "/placeholders/book_page4.jpg",
        handwrittenNote: "Home isn't a place, it's you.",
        sticker: "stamp",
        layout: "polaroid"
      }
    ]
  },
  compliments: [
    "The way your eyes crinkle up with joy whenever you laugh genuinely.",
    "Your kindness and the gentle way you care for the people around you.",
    "How effortless and beautiful you look, even when you're just in an oversized hoodie.",
    "Your laugh — it's genuinely my favorite melody in the whole world.",
    "The cute way your nose scrunches when you're teased or laughing hard.",
    "How passionate and sweet you get when you talk about things you love.",
    "You make every single ordinary place feel like something special just by being there.",
    "You have the warmest, softest heart, and I am so grateful to be loved by you.",
    "Your hugs feel like all the worries in the world just melt away.",
    "You're not just gorgeous on the outside, your soul is even more stunning."
  ],
  reasons: [
    "You make me laugh when nobody else can.",
    "You listen with your whole heart.",
    "Your smile turns my worst days around in an instant.",
    "You believe in me even when I doubt myself.",
    "Holding your hand feels like the most natural thing in the universe.",
    "You make every coffee, car ride, and walk 100x better.",
    "The way you look at me makes me want to be the best version of myself.",
    "You're patient, thoughtful, and deeply loving.",
    "Because no one else in the world could ever replace you."
  ],
  loveLetters: {
    mainLetter: {
      title: "Things I Don't Say Enough",
      date: "November 20, 2026",
      content: "Malak,\n\nSometimes life moves so fast that I don't stop and tell you everything you mean to me as often as I should. I want you to always remember that you are my favorite part of every day. \n\nThank you for your warmth, your patience, your silly jokes, and the endless comfort you bring into my life. Every little memory we've made so far is etched into my heart, and I cannot wait for all the years and memories ahead of us.\n\nHappy Birthday, my beautiful girl. Today is celebrating you, and I hope you feel as cherished and special as you make me feel every single day.",
      polaroidUrl: "/placeholders/letter_polaroid.jpg",
      polaroidCaption: "Forever my favorite person ♡",
      signOff: "With all my love, always and forever"
    },
    openWhenNotes: [
      {
        id: "ow-1",
        title: "Open when you miss me",
        category: "miss-me",
        icon: "Heart",
        content: "Close your eyes for three seconds. Take a deep breath. Imagine my arms wrapped tightly around you, whispering that I'm always thinking about you. Distance or busy hours never change the fact that my heart is always right beside yours.",
        revealPhotoUrl: "/placeholders/open_when_1.jpg"
      },
      {
        id: "ow-2",
        title: "Open when you need a smile",
        category: "need-smile",
        icon: "Sparkles",
        content: "Remember that time we couldn't stop giggling like idiots in public? Or how silly we get over the smallest things? You have the most beautiful smile in the entire world, and the world is always brighter when you share it.",
        revealPhotoUrl: "/placeholders/open_when_2.jpg"
      },
      {
        id: "ow-3",
        title: "Open when you're having a bad day",
        category: "bad-day",
        icon: "Coffee",
        content: "Bad days are temporary, but my love for you is permanent. It's okay to feel tired, stressed, or overwhelmed. Wrap yourself in a cozy blanket, put this phone down, and remember that whatever is weighing on you, you don't have to carry it alone. I've got your back.",
        revealPhotoUrl: "/placeholders/open_when_3.jpg"
      },
      {
        id: "ow-4",
        title: "Open when you want to remember us",
        category: "remember-us",
        icon: "Camera",
        content: "Look through the little photo book on this website. Look at every selfie, every date, and every memory. Every single photo represents a real piece of us that nothing can ever take away.",
        revealPhotoUrl: "/placeholders/open_when_4.jpg"
      },
      {
        id: "ow-5",
        title: "Open when you need a reminder of how loved you are",
        category: "reminder-loved",
        icon: "Gift",
        content: "If you ever wonder how much you mean to me: more than words could ever describe, more than all the stars in the night sky, and more with every single passing day. You are so deeply and unconditionally loved, Malak.",
        revealPhotoUrl: "/placeholders/open_when_5.jpg"
      }
    ]
  },
  dateInvitation: {
    heading: "Malak, can I take you on a date? 🥹",
    question: "Would you go out with me?",
    subtitle: "I planned something special, but first I need your official answer...",
    choices: [
      {
        id: "yes",
        label: "Yes 💗",
        response: "YAYYY! You just made me the happiest person ever. 💗",
        animationEmoji: "💖"
      },
      {
        id: "absolutely",
        label: "Absolutely!! 🥹",
        response: "I KNEW YOU'D SAY YES!! 🥹💕",
        animationEmoji: "🥰"
      },
      {
        id: "hell_yeah",
        label: "HELL YEAH!! ❤️🔥",
        response: "THAT'S MY GIRL!! DATE PLANNING STARTS NOW. ❤️🔥",
        animationEmoji: "🎉"
      }
    ]
  },
  dateQuestions: [
    {
      id: "q-1",
      stepNumber: 1,
      question: "What kind of date are you in the mood for?",
      subtitle: "Choose whatever makes your heart happiest (you can select your favorite or multiple!)",
      type: "multiple",
      options: [
        {
          id: "picnic",
          title: "A Picnic Date 🧺",
          description: "Just you, me, good food, cozy blanket, and a little piece of peace.",
          imageUrl: "/placeholders/date_picnic.jpg",
          emoji: "🧺"
        },
        {
          id: "dinner",
          title: "Restaurant Dinner 🍝",
          description: "Good food, pretty lights, and sitting across from my favorite person.",
          imageUrl: "/placeholders/date_dinner.jpg",
          emoji: "🍝"
        },
        {
          id: "clay",
          title: "A Clay Date 🎨",
          description: "Let's make something cute together, even if it turns out terrible and messy.",
          imageUrl: "/placeholders/date_clay.jpg",
          emoji: "🎨"
        },
        {
          id: "cafe",
          title: "A Café Date ☕",
          description: "Coffee, warm conversations, pastries, and losing track of time.",
          imageUrl: "/placeholders/date_cafe.jpg",
          emoji: "☕"
        },
        {
          id: "movie",
          title: "A Movie Date 🎬",
          description: "A cozy film, popcorn, sweet snacks, and leaning on each other.",
          imageUrl: "/placeholders/date_movie.jpg",
          emoji: "🎬"
        },
        {
          id: "surprise",
          title: "Surprise Me, Baby 🎁",
          description: "Let me plan every single detail for you from start to finish.",
          imageUrl: "/placeholders/date_surprise.jpg",
          emoji: "🎁"
        }
      ]
    },
    {
      id: "q-2",
      stepNumber: 2,
      question: "What color flowers do you want? 💐",
      subtitle: "Pick the shade that matches your mood",
      type: "single",
      options: [
        { id: "red_roses", title: "Red roses ❤️", emoji: "🌹", imageUrl: "/placeholders/flowers_red.jpg" },
        { id: "pink_roses", title: "Pink roses 🩷", emoji: "🌸", imageUrl: "/placeholders/flowers_pink.jpg" },
        { id: "white_flowers", title: "White flowers 🤍", emoji: "🤍", imageUrl: "/placeholders/flowers_white.jpg" },
        { id: "purple_flowers", title: "Purple flowers 💜", emoji: "💜", imageUrl: "/placeholders/flowers_purple.jpg" },
        { id: "yellow_flowers", title: "Yellow flowers 💛", emoji: "💛", imageUrl: "/placeholders/flowers_yellow.jpg" },
        { id: "babys_breath", title: "Baby's breath 🌸", emoji: "🌿", imageUrl: "/placeholders/flowers_babysbreath.jpg" },
        { id: "mixed_bouquet", title: "A colorful mixed bouquet 🌈", emoji: "💐", imageUrl: "/placeholders/flowers_mixed.jpg" },
        { id: "surprise_flower", title: "Surprise me! ✨", emoji: "✨", imageUrl: "/placeholders/flowers_surprise.jpg" }
      ]
    },
    {
      id: "q-3",
      stepNumber: 3,
      question: "What flowers do you like most?",
      subtitle: "Which blooms make you smile?",
      type: "multiple",
      options: [
        { id: "roses", title: "Roses 🌹", emoji: "🌹", imageUrl: "/placeholders/flowers_red.jpg" },
        { id: "tulips", title: "Tulips 🌷", emoji: "🌷", imageUrl: "/placeholders/flowers_pink.jpg" },
        { id: "sunflowers", title: "Sunflowers 🌻", emoji: "🌻", imageUrl: "/placeholders/flowers_yellow.jpg" },
        { id: "lilies", title: "Lilies 🌸", emoji: "🌸", imageUrl: "/placeholders/flowers_white.jpg" },
        { id: "babys_breath_type", title: "Baby's breath 🌿", emoji: "🌿", imageUrl: "/placeholders/flowers_babysbreath.jpg" },
        { id: "mixed_type", title: "Mixed bouquet 💐", emoji: "💐", imageUrl: "/placeholders/flowers_mixed.jpg" },
        { id: "other_flowers", title: "Other / Let me choose 🎀", emoji: "🎀", imageUrl: "/placeholders/flowers_surprise.jpg" }
      ]
    },
    {
      id: "q-4",
      stepNumber: 4,
      question: "What would you like to eat? 🍰",
      subtitle: "Select whatever you are craving right now",
      type: "multiple",
      options: [
        { id: "pizza", title: "Pizza 🍕", emoji: "🍕" },
        { id: "pasta", title: "Pasta 🍝", emoji: "🍝" },
        { id: "burgers", title: "Burgers 🍔", emoji: "🍔" },
        { id: "desserts_coffee", title: "Desserts & coffee ☕🍰", emoji: "🍰" },
        { id: "ice_cream", title: "Ice cream 🍦", emoji: "🍦" },
        { id: "full_dinner", title: "Full restaurant dinner 🍽️", emoji: "🍽️" },
        { id: "something_else", title: "Something else 🤤", emoji: "✨" }
      ],
      placeholder: "Any cravings, allergies, or dietary preferences to know?"
    },
    {
      id: "q-5",
      stepNumber: 5,
      question: "When should our date be?",
      subtitle: "Tell me your ideal timing",
      type: "datetime",
      options: [
        { id: "afternoon", title: "Afternoon (Cozy & bright) ☀️", emoji: "☀️" },
        { id: "sunset", title: "Sunset (Golden & dreamy) 🌅", emoji: "🌅" },
        { id: "evening", title: "Evening (Candlelight & stars) 🌙", emoji: "🌙" },
        { id: "flexible", title: "I'm flexible! You choose 💖", emoji: "💖" }
      ]
    },
    {
      id: "q-6",
      stepNumber: 6,
      question: "What should we do together? 💕",
      subtitle: "Choose any extra cute activities you'd enjoy",
      type: "multiple",
      options: [
        { id: "cute_pics", title: "Take cute pictures 📸", emoji: "📸" },
        { id: "make_scrapbook", title: "Make a scrapbook together ✂️", emoji: "✂️" },
        { id: "clay_paint", title: "Paint or make clay art 🎨", emoji: "🎨" },
        { id: "walk_beautiful", title: "Walk somewhere scenic 🌿", emoji: "🌿" },
        { id: "watch_sunset", title: "Watch the sunset 🌅", emoji: "🌅" },
        { id: "exchange_gifts", title: "Exchange little surprise gifts 🎁", emoji: "🎁" },
        { id: "deep_talks", title: "Have deep, uninterrupted talks 💬", emoji: "💬" },
        { id: "you_choose", title: "Something you choose for us ♡", emoji: "💖" }
      ]
    },
    {
      id: "q-7",
      stepNumber: 7,
      question: "A little note for me 💌",
      subtitle: "Is there anything else you'd love for our date?",
      type: "text",
      placeholder: "Write whatever is on your mind, special ideas, or sweet requests..."
    }
  ],
  dateSubmissions: []
};

// Database manager with atomic writes
class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required fields exist
        return {
          ...initialData,
          ...parsed,
          settings: { ...initialData.settings, ...(parsed.settings || {}) },
          photobook: { ...initialData.photobook, ...(parsed.photobook || {}) },
          loveLetters: { ...initialData.loveLetters, ...(parsed.loveLetters || {}) },
          dateInvitation: { ...initialData.dateInvitation, ...(parsed.dateInvitation || {}) }
        };
      }
    } catch (err) {
      console.error('Error reading database file, using defaults:', err);
    }
    // Write defaults
    this.persist(initialData);
    return initialData;
  }

  private persist(dataToSave: DatabaseSchema) {
    this.ensureDataDir();
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public save() {
    this.persist(this.data);
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  public resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }
}

export const db = new Database();
