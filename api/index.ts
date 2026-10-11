process.env.VERCEL = process.env.VERCEL || '1';

import { initDatabase } from '../server/src/db.js';
import app from '../server/src/index.js';

// Initialize DB once (cached across warm invocations on Vercel)
const initPromise = initDatabase();

export default async function handler(req: any, res: any) {
  // Wait for MongoDB connection before handling requests
  await initPromise;

  // Normalize URL so Express routes always match whether rewritten with /api or not
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
