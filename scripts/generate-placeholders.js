import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../client/public/placeholders');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createPlaceholderSvg(title, subtitle, iconType = 'camera', bgTheme = 'rose', width = 800, height = 600) {
  const themes = {
    rose: { bg1: '#fff0f3', bg2: '#ffe3e8', border: '#e8a5b2', text: '#872f3f', subtext: '#b25868', icon: '#c94d65' },
    cream: { bg1: '#fdfbf7', bg2: '#f6ecdc', border: '#dfc29f', text: '#6d4c3d', subtext: '#9c735d', icon: '#bd8c53' },
    sunset: { bg1: '#fff4ed', bg2: '#ffe0d2', border: '#f3b89b', text: '#8a4023', subtext: '#b56848', icon: '#d96b3d' },
    lavender: { bg1: '#f8f5fc', bg2: '#ece3f8', border: '#cebfe8', text: '#5d4182', subtext: '#8365ab', icon: '#9b7ebb' },
    burgundy: { bg1: '#faeaed', bg2: '#f2ccd3', border: '#d98b9a', text: '#550d1a', subtext: '#822436', icon: '#a63248' }
  };

  const t = themes[bgTheme] || themes.rose;

  let iconSvg = '';
  if (iconType === 'heart') {
    iconSvg = `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${t.icon}"/>`;
  } else if (iconType === 'flower') {
    iconSvg = `<circle cx="12" cy="12" r="3" fill="#ffd166"/>
      <path d="M12 4a3 3 0 0 1 3 3c0 2-3 5-3 5s-3-3-3-5a3 3 0 0 1 3-3zm8 8a3 3 0 0 1-3 3c-2 0-5-3-5-3s3-3 5-3a3 3 0 0 1 3 3zm-8 8a3 3 0 0 1-3-3c0-2 3-5 3-5s3 3 3 5a3 3 0 0 1-3 3zm-8-8a3 3 0 0 1 3-3c2 0 5 3 5 3s-3 3-5 3a3 3 0 0 1-3-3z" fill="${t.icon}"/>`;
  } else if (iconType === 'picnic') {
    iconSvg = `<path d="M4 10h16v10H4z" fill="${t.icon}" opacity="0.3"/><path d="M6 10V7a6 6 0 0 1 12 0v3" fill="none" stroke="${t.icon}" stroke-width="2"/><path d="M4 14h16M12 10v10" stroke="${t.icon}" stroke-width="1.5"/>`;
  } else if (iconType === 'dinner') {
    iconSvg = `<circle cx="12" cy="12" r="7" fill="none" stroke="${t.icon}" stroke-width="2"/><path d="M3 6v6a2 2 0 0 0 2 2h0v6M19 6v14M21 6h-4v4a2 2 0 0 0 2 2v8" stroke="${t.icon}" stroke-width="1.5"/>`;
  } else if (iconType === 'cafe') {
    iconSvg = `<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" fill="none" stroke="${t.icon}" stroke-width="2"/><path d="M6 1v3M10 1v3M14 1v3" stroke="${t.icon}" stroke-width="1.5"/>`;
  } else if (iconType === 'movie') {
    iconSvg = `<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="${t.icon}" stroke-width="2"/><path d="M7 4v16M17 4v16M2 8h20M2 16h20" stroke="${t.icon}" stroke-width="1.5"/>`;
  } else if (iconType === 'clay') {
    iconSvg = `<path d="M12 2a5 5 0 0 0-5 5c0 3 5 7 5 7s5-4 5-7a5 5 0 0 0-5-5z" fill="${t.icon}" opacity="0.5"/><circle cx="12" cy="17" r="5" fill="none" stroke="${t.icon}" stroke-width="2"/>`;
  } else if (iconType === 'gift') {
    iconSvg = `<rect x="3" y="8" width="18" height="13" rx="2" fill="none" stroke="${t.icon}" stroke-width="2"/><path d="M12 8v13M3 13h18M12 8a3 3 0 0 0-3-3 2 2 0 0 0 0 4h3zm0 0a3 3 0 0 1 3-3 2 2 0 0 1 0 4h-3z" stroke="${t.icon}" stroke-width="1.5"/>`;
  } else {
    // camera
    iconSvg = `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="${t.icon}" stroke-width="2"/><circle cx="12" cy="13" r="4" fill="none" stroke="${t.icon}" stroke-width="2"/>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg1}" />
      <stop offset="100%" stop-color="${t.bg2}" />
    </linearGradient>
    <pattern id="scrapbook-dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${t.border}" opacity="0.3"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#scrapbook-dots)"/>

  <!-- Inner Polaroid / Card Border -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="12" fill="none" stroke="${t.border}" stroke-width="2" stroke-dasharray="6,6" opacity="0.8"/>

  <!-- Icon Container -->
  <g transform="translate(${width / 2 - 36}, ${height / 2 - 80}) scale(3)">
    ${iconSvg}
  </g>

  <!-- Title -->
  <text x="${width / 2}" y="${height / 2 + 50}" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="${t.text}" text-anchor="middle">
    ${title}
  </text>

  <!-- Subtitle -->
  <text x="${width / 2}" y="${height / 2 + 85}" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="${t.subtext}" text-anchor="middle">
    ${subtitle}
  </text>

  <!-- Little hint badge -->
  <rect x="${width / 2 - 130}" y="${height / 2 + 115}" width="260" height="28" rx="14" fill="${t.border}" opacity="0.35"/>
  <text x="${width / 2}" y="${height / 2 + 134}" font-family="'Caveat', cursive" font-size="16" fill="${t.text}" text-anchor="middle">
    ✨ Replace with your photo in Admin Panel
  </text>
</svg>`;
}

const placeholders = [
  { file: 'hero_together.jpg', title: 'Our Favorite Picture Together', sub: 'Add a picture of you two smiling together', icon: 'heart', theme: 'burgundy' },
  { file: 'favorite_portrait.jpg', title: 'My Favorite Picture of You', sub: 'A beautiful portrait of Malak that takes your breath away', icon: 'heart', theme: 'rose' },
  { file: 'timeline_1.jpg', title: 'When We First Met', sub: 'Add a picture from the beginning of your journey', icon: 'camera', theme: 'rose' },
  { file: 'timeline_2.jpg', title: 'Our First Picture Together', sub: 'That first sweet selfie or candid moment', icon: 'camera', theme: 'cream' },
  { file: 'timeline_3.jpg', title: 'Our Funniest Memory', sub: 'A goofy, hilarious candid of you both laughing', icon: 'camera', theme: 'sunset' },
  { file: 'timeline_4.jpg', title: 'Our Favorite Date', sub: 'That special dinner, walk, or cafe trip you loved', icon: 'camera', theme: 'lavender' },
  { file: 'timeline_5.jpg', title: 'A Moment I Never Want to Forget', sub: 'A heartfelt, irreplaceable memory with Malak', icon: 'camera', theme: 'burgundy' },
  { file: 'timeline_6.jpg', title: 'Our Most Recent Memory', sub: 'A warm recent snapshot together', icon: 'camera', theme: 'rose' },
  { file: 'timeline_7.jpg', title: 'A Future Memory We Have Yet to Make', sub: 'A placeholder for all your upcoming adventures', icon: 'heart', theme: 'sunset' },

  // Gallery
  { file: 'gallery_1.jpg', title: 'Golden Hour Glow', sub: 'Malak in beautiful warm lighting', icon: 'camera', theme: 'sunset' },
  { file: 'gallery_2.jpg', title: 'Coffee & Cozy Talks', sub: 'A favorite cafe date memory', icon: 'cafe', theme: 'cream' },
  { file: 'gallery_3.jpg', title: 'Hand in Hand', sub: 'Walking together holding hands', icon: 'heart', theme: 'rose' },
  { file: 'gallery_4.jpg', title: 'Spontaneous Laughter', sub: 'A genuine candid mid-laugh', icon: 'camera', theme: 'lavender' },
  { file: 'gallery_5.jpg', title: 'Picnic Afternoon', sub: 'Sunny picnic date snapshot', icon: 'picnic', theme: 'cream' },

  // Photobook
  { file: 'book_cover.jpg', title: 'A Little Book of Us', sub: 'The keepsake album cover photo', icon: 'heart', theme: 'burgundy' },
  { file: 'book_page1.jpg', title: 'Chapter One: The Spark', sub: 'A memory of your first conversations', icon: 'camera', theme: 'rose' },
  { file: 'book_page2.jpg', title: 'Late Night Conversations', sub: 'Sweet memories of talking until dawn', icon: 'camera', theme: 'lavender' },
  { file: 'book_page3.jpg', title: 'Sunny Afternoons', sub: 'Walking nowhere in particular together', icon: 'camera', theme: 'cream' },
  { file: 'book_page4.jpg', title: 'The Quiet Moments', sub: 'Comfortable silence and holding each other close', icon: 'heart', theme: 'rose' },

  // Love letter polaroid & open when
  { file: 'letter_polaroid.jpg', title: 'Forever My Favorite Person', sub: 'A sweet polaroid to go with your personal letter', icon: 'heart', theme: 'burgundy' },
  { file: 'open_when_1.jpg', title: 'Open When You Miss Me', sub: 'A warm comforting picture of your hug or hands', icon: 'heart', theme: 'rose' },
  { file: 'open_when_2.jpg', title: 'Open When You Need A Smile', sub: 'The funniest or silliest face you two made', icon: 'camera', theme: 'sunset' },
  { file: 'open_when_3.jpg', title: 'Open When Having A Bad Day', sub: 'A cozy reminder that she is safe and loved', icon: 'heart', theme: 'cream' },
  { file: 'open_when_4.jpg', title: 'Open When Remembering Us', sub: 'A snapshot of a magical milestone', icon: 'camera', theme: 'lavender' },
  { file: 'open_when_5.jpg', title: 'A Reminder of How Loved You Are', sub: 'You looking at her with pure adoration', icon: 'heart', theme: 'burgundy' },

  // Date planner pictures
  { file: 'date_picnic.jpg', title: 'A Cozy Picnic Date 🧺', sub: 'Strawberries, fresh breeze, blanket & sunshine', icon: 'picnic', theme: 'cream' },
  { file: 'date_dinner.jpg', title: 'Romantic Restaurant Dinner 🍝', sub: 'Warm candlelight, pasta & good drinks', icon: 'dinner', theme: 'burgundy' },
  { file: 'date_clay.jpg', title: 'A Clay & Pottery Date 🎨', sub: 'Clay modeling, paint & creative fun', icon: 'clay', theme: 'rose' },
  { file: 'date_cafe.jpg', title: 'Cozy Café & Pastries ☕', sub: 'Coffee, sweet conversations & pastries', icon: 'cafe', theme: 'cream' },
  { file: 'date_movie.jpg', title: 'Movie Night & Popcorn 🎬', sub: 'Cozy blankets, film & leaning close', icon: 'movie', theme: 'lavender' },
  { file: 'date_surprise.jpg', title: 'Surprise Me, Baby 🎁', sub: 'A completely secret date planned for her', icon: 'gift', theme: 'sunset' },

  // Flowers
  { file: 'flowers_red.jpg', title: 'Classic Red Roses ❤️', sub: 'Timeless romance and passion', icon: 'flower', theme: 'burgundy' },
  { file: 'flowers_pink.jpg', title: 'Soft Pink Roses 🩷', sub: 'Delicate, sweet and elegant', icon: 'flower', theme: 'rose' },
  { file: 'flowers_white.jpg', title: 'Pure White Flowers 🤍', sub: 'Peaceful, bright and graceful', icon: 'flower', theme: 'cream' },
  { file: 'flowers_purple.jpg', title: 'Dreamy Purple Blooms 💜', sub: 'Lavender, lilacs and purple petals', icon: 'flower', theme: 'lavender' },
  { file: 'flowers_yellow.jpg', title: 'Bright Sunflowers & Yellow Blooms 💛', sub: 'Cheerful, warm and glowing like the sun', icon: 'flower', theme: 'sunset' },
  { file: 'flowers_babysbreath.jpg', title: "Ethereal Baby's Breath 🌸", sub: 'Soft white clouds of delicate floral beauty', icon: 'flower', theme: 'cream' },
  { file: 'flowers_mixed.jpg', title: 'Colorful Mixed Bouquet 💐', sub: 'A vibrant blend of her favorite flowers', icon: 'flower', theme: 'rose' },
  { file: 'flowers_surprise.jpg', title: 'Surprise Bouquet ✨', sub: 'A custom florist bouquet picked just for her', icon: 'flower', theme: 'lavender' }
];

placeholders.forEach(p => {
  const content = createPlaceholderSvg(p.title, p.sub, p.icon, p.theme);
  fs.writeFileSync(path.join(outDir, p.file), content, 'utf-8');
});

console.log(`Created ${placeholders.length} romantic placeholder images in ${outDir}`);
