import mongoose, { Mongoose } from "mongoose";

const { MONGODB_URI = "", MONGODB_DB_NAME } = process.env;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined. Add it to your environment variables.");
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

let cached = global.__mongooseCache;

if (!cached) {
  cached = { conn: null, promise: null };
  global.__mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      bufferCommands: false,
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn!;
}
