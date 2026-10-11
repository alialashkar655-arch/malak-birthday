import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import 'dotenv/config';
import { db, initDatabase } from './db.js';
import { requireAdmin, loginAdmin, isValidAdminToken, revokeAdminToken, changeAdminPassword } from './auth.js';
import { DateSubmission, TimelineEntry, GalleryItem, PhotobookPage } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Setup directories
const UPLOADS_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'malak_uploads')
  : path.resolve(__dirname, '../uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Ignore error on read-only environments
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for photos/videos
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|mp4|webm|mov|mp3|wav|m4a|ogg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images, videos, and audio files are supported'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));

// Also serve client public assets if needed
const CLIENT_PUBLIC = path.resolve(__dirname, '../../client/public');
if (fs.existsSync(CLIENT_PUBLIC)) {
  app.use('/placeholders', express.static(path.join(CLIENT_PUBLIC, 'placeholders')));
}

/* =========================================================
   AUTHENTICATION ENDPOINTS
========================================================= */

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }
  const result = await loginAdmin(password);
  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }
  res.json({ token: result.token });
});

app.get('/api/auth/verify', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ valid: false });
    return;
  }
  const token = authHeader.substring(7).trim();
  const valid = await isValidAdminToken(token);
  res.json({ valid });
});

app.post('/api/auth/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    await revokeAdminToken(authHeader.substring(7).trim());
  }
  res.json({ success: true });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = changeAdminPassword(currentPassword, newPassword);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

/* =========================================================
   MEDIA UPLOAD ENDPOINTS
========================================================= */

app.post('/api/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  const isVideo = req.file.mimetype.startsWith('video');
  const isAudio = req.file.mimetype.startsWith('audio');
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    type: isVideo ? 'video' : isAudio ? 'audio' : 'image'
  });
});

app.post('/api/upload/multiple', requireAdmin, upload.array('files', 12), (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const results = files.map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    type: file.mimetype.startsWith('video') ? 'video' : 'image'
  }));
  res.json({ files: results });
});

/* =========================================================
   SETTINGS ENDPOINTS
========================================================= */

app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  // Don't leak the password hash to the client
  const { adminPasswordHash, ...safeSettings } = settings;
  res.json(safeSettings);
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updates = req.body;
  // Prevent directly overwriting password hash via settings update
  delete updates.adminPasswordHash;
  const updated = db.updateSettings(updates);
  const { adminPasswordHash, ...safeSettings } = updated;
  res.json(safeSettings);
});

/* =========================================================
   TIMELINE ENDPOINTS
========================================================= */

app.get('/api/timeline', (_req: Request, res: Response) => {
  const data = db.getData();
  const sorted = [...data.timeline].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.post('/api/timeline', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const newEntry: TimelineEntry = {
    id: `tl-${Date.now()}`,
    title: req.body.title || 'Our New Memory',
    date: req.body.date || '',
    caption: req.body.caption || '',
    mediaUrl: req.body.mediaUrl || '',
    mediaType: req.body.mediaType || 'image',
    handwrittenNote: req.body.handwrittenNote || '',
    sticker: req.body.sticker || 'heart',
    order: data.timeline.length + 1
  };
  data.timeline.push(newEntry);
  db.save();
  res.status(201).json(newEntry);
});

app.put('/api/timeline/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const index = data.timeline.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Timeline entry not found' });
    return;
  }
  data.timeline[index] = { ...data.timeline[index], ...req.body, id: req.params.id };
  db.save();
  res.json(data.timeline[index]);
});

app.delete('/api/timeline/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.timeline = data.timeline.filter(t => t.id !== req.params.id);
  // Re-index order
  data.timeline.forEach((item, idx) => { item.order = idx + 1; });
  db.save();
  res.json({ success: true });
});

app.post('/api/timeline/reorder', requireAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body as { orderedIds: string[] };
  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds array required' });
    return;
  }
  const data = db.getData();
  const map = new Map(data.timeline.map(t => [t.id, t]));
  const reordered: TimelineEntry[] = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      item.order = idx + 1;
      reordered.push(item);
    }
  });
  data.timeline = reordered;
  db.save();
  res.json(reordered);
});

/* =========================================================
   GALLERY ENDPOINTS
========================================================= */

app.get('/api/gallery', (_req: Request, res: Response) => {
  const data = db.getData();
  const sorted = [...data.gallery].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.post('/api/gallery', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: req.body.title || 'Special Moment',
    caption: req.body.caption || '',
    date: req.body.date || '',
    category: req.body.category || 'Our Pictures',
    mediaUrl: req.body.mediaUrl || '',
    mediaType: req.body.mediaType || 'image',
    isFavorite: Boolean(req.body.isFavorite),
    order: data.gallery.length + 1
  };
  data.gallery.push(newItem);
  db.save();
  res.status(201).json(newItem);
});

app.put('/api/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const index = data.gallery.findIndex(g => g.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Gallery item not found' });
    return;
  }
  data.gallery[index] = { ...data.gallery[index], ...req.body, id: req.params.id };
  db.save();
  res.json(data.gallery[index]);
});

app.delete('/api/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.gallery = data.gallery.filter(g => g.id !== req.params.id);
  data.gallery.forEach((g, idx) => { g.order = idx + 1; });
  db.save();
  res.json({ success: true });
});

// Allow visitors / partners to favorite photos directly
app.post('/api/gallery/:id/favorite', (req: Request, res: Response) => {
  const data = db.getData();
  const item = data.gallery.find(g => g.id === req.params.id);
  if (!item) {
    // If not found in gallery (e.g. temporary preview), return gracefully without 404
    res.json({ isFavorite: true });
    return;
  }
  item.isFavorite = !item.isFavorite;
  db.save();
  res.json({ isFavorite: item.isFavorite });
});

/* =========================================================
   PHOTOBOOK ENDPOINTS
========================================================= */

app.get('/api/photobook', (_req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.photobook);
});

app.put('/api/photobook/info', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.photobook = {
    ...data.photobook,
    coverTitle: req.body.coverTitle ?? data.photobook.coverTitle,
    coverSubtitle: req.body.coverSubtitle ?? data.photobook.coverSubtitle,
    coverPhotoUrl: req.body.coverPhotoUrl ?? data.photobook.coverPhotoUrl,
    secretPageQuote: req.body.secretPageQuote ?? data.photobook.secretPageQuote,
    backCoverLetterTitle: req.body.backCoverLetterTitle ?? data.photobook.backCoverLetterTitle,
    backCoverLetter: req.body.backCoverLetter ?? data.photobook.backCoverLetter,
  };
  db.save();
  res.json(data.photobook);
});

app.post('/api/photobook/pages', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const newPage: PhotobookPage = {
    id: `page-${Date.now()}`,
    pageNumber: data.photobook.pages.length + 1,
    title: req.body.title || 'New Page',
    caption: req.body.caption || '',
    date: req.body.date || '',
    mediaUrl: req.body.mediaUrl || '',
    handwrittenNote: req.body.handwrittenNote || '',
    sticker: req.body.sticker || 'heart',
    layout: req.body.layout || 'polaroid'
  };
  data.photobook.pages.push(newPage);
  db.save();
  res.status(201).json(newPage);
});

app.put('/api/photobook/pages/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  const index = data.photobook.pages.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  data.photobook.pages[index] = { ...data.photobook.pages[index], ...req.body, id: req.params.id };
  db.save();
  res.json(data.photobook.pages[index]);
});

app.delete('/api/photobook/pages/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.photobook.pages = data.photobook.pages.filter(p => p.id !== req.params.id);
  data.photobook.pages.forEach((p, idx) => { p.pageNumber = idx + 1; });
  db.save();
  res.json({ success: true });
});

/* =========================================================
   COMPLIMENTS & REASONS
========================================================= */

app.get('/api/compliments', (_req: Request, res: Response) => {
  res.json(db.getData().compliments);
});

app.put('/api/compliments', requireAdmin, (req: Request, res: Response) => {
  const { compliments } = req.body;
  if (!Array.isArray(compliments)) {
    res.status(400).json({ error: 'compliments array required' });
    return;
  }
  const data = db.getData();
  data.compliments = compliments;
  db.save();
  res.json(data.compliments);
});

app.get('/api/reasons', (_req: Request, res: Response) => {
  res.json(db.getData().reasons);
});

app.put('/api/reasons', requireAdmin, (req: Request, res: Response) => {
  const { reasons } = req.body;
  if (!Array.isArray(reasons)) {
    res.status(400).json({ error: 'reasons array required' });
    return;
  }
  const data = db.getData();
  data.reasons = reasons;
  db.save();
  res.json(data.reasons);
});

/* =========================================================
   LOVE LETTERS & "OPEN WHEN..."
========================================================= */

app.get('/api/letters', (_req: Request, res: Response) => {
  res.json(db.getData().loveLetters);
});

app.put('/api/letters', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.loveLetters = { ...data.loveLetters, ...req.body };
  db.save();
  res.json(data.loveLetters);
});

/* =========================================================
   DATE INVITATION & QUESTIONS
========================================================= */

app.get('/api/date-invitation', (_req: Request, res: Response) => {
  res.json(db.getData().dateInvitation);
});

app.put('/api/date-invitation', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.dateInvitation = { ...data.dateInvitation, ...req.body };
  db.save();
  res.json(data.dateInvitation);
});

app.get('/api/date-questions', (_req: Request, res: Response) => {
  res.json(db.getData().dateQuestions);
});

app.put('/api/date-questions', requireAdmin, (req: Request, res: Response) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: 'Questions array required' });
    return;
  }
  const data = db.getData();
  data.dateQuestions = questions;
  db.save();
  res.json(data.dateQuestions);
});

/* =========================================================
   DATE SUBMISSIONS (Malak sends her dream date)
========================================================= */

app.post('/api/date-submissions', (req: Request, res: Response) => {
  const {
    invitationAnswerId,
    invitationAnswerLabel,
    dateType,
    flowerColor,
    flowerType,
    foodChoice,
    foodNotes,
    preferredDate,
    preferredTimeOfDay,
    activities,
    personalNote
  } = req.body;

  if (!invitationAnswerId) {
    res.status(400).json({ error: 'Invitation answer is required' });
    return;
  }

  const submission: DateSubmission = {
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    invitationAnswerId: String(invitationAnswerId),
    invitationAnswerLabel: String(invitationAnswerLabel || 'Yes 💗'),
    dateType: Array.isArray(dateType) ? dateType : [String(dateType || '')],
    flowerColor: String(flowerColor || 'Red roses'),
    flowerType: Array.isArray(flowerType) ? flowerType : [String(flowerType || '')],
    foodChoice: Array.isArray(foodChoice) ? foodChoice : [String(foodChoice || '')],
    foodNotes: String(foodNotes || ''),
    preferredDate: String(preferredDate || ''),
    preferredTimeOfDay: String(preferredTimeOfDay || ''),
    activities: Array.isArray(activities) ? activities : [],
    personalNote: String(personalNote || ''),
    status: 'new'
  };

  const data = db.getData();
  data.dateSubmissions.unshift(submission); // Newest first
  db.save();

  res.status(201).json({
    success: true,
    submissionId: submission.id,
    message: "Your wish list is officially in my hands. Now let me make our date special. ♡"
  });
});

app.get('/api/date-submissions', requireAdmin, (_req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.dateSubmissions);
});

app.delete('/api/date-submissions/:id', requireAdmin, (req: Request, res: Response) => {
  const data = db.getData();
  data.dateSubmissions = data.dateSubmissions.filter(s => s.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

/* =========================================================
   ADMIN BACKUP / RESTORE / RESET
========================================================= */

app.get('/api/admin/backup', requireAdmin, (_req: Request, res: Response) => {
  const data = db.getData();
  // Strip password hash for export safety
  const { settings, ...rest } = data;
  const { adminPasswordHash, ...safeSettings } = settings;
  res.json({ settings: safeSettings, ...rest });
});

app.post('/api/admin/restore', requireAdmin, (req: Request, res: Response) => {
  const importedData = req.body;
  if (!importedData || !importedData.settings) {
    res.status(400).json({ error: 'Invalid backup structure' });
    return;
  }
  const currentSettings = db.getSettings();
  // Preserve current password hash
  importedData.settings.adminPasswordHash = currentSettings.adminPasswordHash;
  const current = db.getData();
  Object.assign(current, importedData);
  db.save();
  res.json({ success: true, message: 'Data restored successfully' });
});

app.post('/api/admin/reset-defaults', requireAdmin, (_req: Request, res: Response) => {
  const reset = db.resetToDefaults();
  res.json({ success: true, message: 'Reset to initial romantic seeds' });
});

/* =========================================================
   SERVE CLIENT FRONTEND & SPA FALLBACK
========================================================= */

const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
} else {
  app.get('/', (_req: Request, res: Response) => {
    res.redirect('http://localhost:5173');
  });
}

/* =========================================================
   EXPORT & START SERVER
========================================================= */

export { app };
export default app;

// Local development: initialize DB and start server
// On Vercel, api/index.ts handles initialization
if (!process.env.VERCEL) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`❤️ Romantic Memory Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
