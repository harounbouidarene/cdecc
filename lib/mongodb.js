import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// نخزن الاتصال في global باش Next ما يفتح اتصال جديد في كل تعديل
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export default async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
