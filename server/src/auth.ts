import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, verifyPassword, hashPassword } from './db.js';

interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

const sessions = new Map<string, AdminSession>();
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createAdminSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  sessions.set(token, {
    token,
    createdAt: now,
    expiresAt: now + SESSION_TTL
  });
  return token;
}

export function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function revokeAdminToken(token: string) {
  sessions.delete(token);
}

// Middleware to protect admin routes
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!isValidAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  next();
}

// Handle login
export function loginAdmin(password: string): { success: boolean; token?: string; error?: string } {
  const settings = db.getSettings();
  const isValid = verifyPassword(password, settings.adminPasswordHash);
  if (!isValid) {
    return { success: false, error: 'Incorrect password' };
  }
  const token = createAdminSession();
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
