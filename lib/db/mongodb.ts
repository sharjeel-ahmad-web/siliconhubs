import { MongoClient, Db } from 'mongodb';

const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-export';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'rising-dot';

const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

function getClientPromise(): Promise<MongoClient> {
  if (isBuildPhase || !uri) {
    return Promise.reject(
      isBuildPhase
        ? new Error('MongoDB not available during build phase')
        : new Error('MONGODB_URI is not set')
    );
  }

  const g = global;
  if (!g._mongoClientPromise) {
    const client = new MongoClient(uri, mongoOptions);
    g._mongoClientPromise = client.connect();
  }
  return g._mongoClientPromise;
}

const clientPromise = getClientPromise();

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

/** Establish connection and return DB. Call this at the start of API handlers so connection is ready before queries. */
export async function connectDB(): Promise<Db> {
  const client = await clientPromise;
  if (!client) {
    throw new Error('MongoDB client not available');
  }
  return client.db(dbName);
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  CONTACTS: 'contacts',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
  SETTINGS: 'settings',
  ANALYTICS_PAGEVIEWS: 'analytics_pageviews',
  ANALYTICS_SESSIONS: 'analytics_sessions',
  ANALYTICS_EVENTS: 'analytics_events',
} as const;
