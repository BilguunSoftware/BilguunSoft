import { mkdir } from "fs/promises";
import path from "path";

import { MongoClient, type Collection, type Db } from "mongodb";

import type { WebsiteType } from "@/data/templates";

export type InquiryRecord = {
  name: string;
  contact: string;
  websiteType: WebsiteType;
  message: string;
  templateId: string | null;
  templateName: string | null;
  createdAt: Date;
};

type MongoGlobal = {
  client?: Promise<MongoClient>;
  starting?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & {
  __bilguunMongo?: MongoGlobal;
};

function store(): MongoGlobal {
  if (!globalMongo.__bilguunMongo) {
    globalMongo.__bilguunMongo = {};
  }

  return globalMongo.__bilguunMongo;
}

async function resolveUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  if (process.env.NODE_ENV === "production") return null;

  const dbPath = path.join(process.cwd(), ".data", "mongo");
  await mkdir(dbPath, { recursive: true });

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const memory = await MongoMemoryServer.create({
    instance: {
      dbName: "bilguunsoft",
      dbPath,
      storageEngine: "wiredTiger",
    },
  });

  return memory.getUri();
}

async function connectClient() {
  const uri = await resolveUri();
  if (!uri) throw new Error("MongoDB is not configured.");

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  return client;
}

export async function getDb(): Promise<Db | null> {
  const cached = store();

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
    return null;
  }

  if (!cached.client) {
    cached.starting ??= connectClient().then(
      (client) => {
        cached.client = Promise.resolve(client);
        return client;
      },
      (error: unknown) => {
        cached.starting = undefined;
        throw error;
      },
    );
  }

  const client = await (cached.client ?? cached.starting);
  if (!client) return null;

  return client.db(process.env.MONGODB_DB ?? "bilguunsoft");
}

export async function inquiriesCollection(): Promise<Collection<InquiryRecord> | null> {
  const db = await getDb();
  if (!db) return null;

  const collection = db.collection<InquiryRecord>("inquiries");
  await collection.createIndex({ createdAt: -1 });
  return collection;
}
