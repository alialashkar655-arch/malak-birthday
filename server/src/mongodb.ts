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
