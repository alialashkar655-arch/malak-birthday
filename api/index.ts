process.env.VERCEL = process.env.VERCEL || '1';
import app from '../server/src/index.js';

export default function handler(req: any, res: any) {
  // Normalize URL so Express routes always match whether rewritten with /api or not
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
