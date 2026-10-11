import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, verifyPassword, hashPassword } from './db.js';
import { mongoCreateSession, mongoIsValidToken, mongoRevokeToken } from './mongodb.js';

interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory fallback (local dev without MongoDB)
const localSessions = new Map<string, AdminSession>();
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const MONGO_URI = process.env.MONGODB_URI || '';

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  if (MONGO_URI) {
    // Persist session in MongoDB so it survives across serverless instances
    await mongoCreateSession(token, SESSION_TTL);
  } else {
    localSessions.set(token, { token, createdAt: now, expiresAt: now + SESSION_TTL });
  }

  return token;
}

export async function isValidAdminToken(token: string): Promise<boolean> {
  if (!token) return false;

  if (MONGO_URI) {
    return mongoIsValidToken(token);
  }

  // Local fallback
  const session = localSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    localSessions.delete(token);
    return false;
  }
  return true;
}

export async function revokeAdminToken(token: string): Promise<void> {
  if (MONGO_URI) {
    await mongoRevokeToken(token);
  } else {
    localSessions.delete(token);
  }
}

// Async middleware to protect admin routes
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.substring(7).trim();

  // Use async validation
  isValidAdminToken(token).then(valid => {
    if (!valid) {
      res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
      return;
    }
    next();
  }).catch(err => {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Internal server error during auth check' });
  });
}

// Handle login
export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const settings = db.getSettings();
  const isValid = verifyPassword(password, settings.adminPasswordHash);
  if (!isValid) {
    return { success: false, error: 'Incorrect password' };
  }
  const token = await createAdminSession();
  return { success: true, token };
}

// Change password
export function changeAdminPassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const settings = db.getSettings();
  const isValid = verifyPassword(oldPassword, settings.adminPasswordHash);
  if (!isValid) {
    return { success: false, error: 'Current password incorrect' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }
  const newHash = hashPassword(newPassword);
  db.updateSettings({ adminPasswordHash: newHash });
  return { success: true };
}
