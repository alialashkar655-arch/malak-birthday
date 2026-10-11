/**
 * MongoDB persistence layer for Malak's Birthday site.
 * Used when MONGODB_URI env var is set (e.g. on Vercel).
 * Falls back to file-based db.ts when running locally without MongoDB.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { DatabaseSchema } from './types.js';

let isConnected = false;

export async function connectMongo(uri: string): Promise<void> {
  if (isConnected) return;
  await mongoose.connect(uri, { dbName: 'malak_birthday' });
  isConnected = true;
  console.log('✅ Connected to MongoDB Atlas');
}

// --- Mongoose schema: one document holds the entire database ---

interface IStore extends Document {
  key: string; // always "main"
  data: DatabaseSchema;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>({
  key: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

let StoreModel: Model<IStore>;

function getModel(): Model<IStore> {
  if (!StoreModel) {
    // Prevent "Cannot overwrite model once compiled" error on hot-reload
    StoreModel = (mongoose.models['Store'] as Model<IStore>) ||
      mongoose.model<IStore>('Store', StoreSchema);
  }
  return StoreModel;
}

export async function mongoLoad(initialData: DatabaseSchema): Promise<DatabaseSchema> {
  const Store = getModel();
  let doc = await Store.findOne({ key: 'main' });
  if (!doc) {
    // First run: seed with initialData
    doc = await Store.create({ key: 'main', data: initialData, updatedAt: new Date() });
    console.log('🌱 Seeded MongoDB with initial romantic data');
  }
  return doc.data as DatabaseSchema;
}

export async function mongoSave(data: DatabaseSchema): Promise<void> {
  const Store = getModel();
  await Store.findOneAndUpdate(
    { key: 'main' },
    { data, updatedAt: new Date() },
    { upsert: true, new: true }
  );
}

// --- MongoDB-backed admin sessions (survives serverless cold starts) ---

interface ISession extends Document {
  token: string;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL index: auto-delete when expired
});

let SessionModel: Model<ISession>;

function getSessionModel(): Model<ISession> {
  if (!SessionModel) {
    SessionModel = (mongoose.models['Session'] as Model<ISession>) ||
      mongoose.model<ISession>('Session', SessionSchema);
  }
  return SessionModel;
}

/** Save a new session token to MongoDB */
export async function mongoCreateSession(token: string, ttlMs: number): Promise<void> {
  const Session = getSessionModel();
  await Session.create({ token, expiresAt: new Date(Date.now() + ttlMs) });
}

/** Check if a token is valid (not expired, exists in DB) */
export async function mongoIsValidToken(token: string): Promise<boolean> {
  const Session = getSessionModel();
  const doc = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
  return doc !== null;
}

/** Remove a session token (logout) */
export async function mongoRevokeToken(token: string): Promise<void> {
  const Session = getSessionModel();
  await Session.deleteOne({ token });
}
