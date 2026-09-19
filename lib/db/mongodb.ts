import { MongoClient, Db } from 'mongodb';

const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-export';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'siliconhubs';

const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

const g = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoClientPromise(): Promise<MongoClient> {
  if (isBuildPhase) {
    return Promise.reject(
      new Error('MongoDB not available during build phase')
    );
  }
  if (!uri) {
    return Promise.reject(new Error('MONGODB_URI is not set'));
  }
  if (!g._mongoClientPromise) {
    const client = new MongoClient(uri, mongoOptions);
    g._mongoClientPromise = client.connect();
  }
  return g._mongoClientPromise;
}

/**
 * Lazy client promise.
 *
 * Importing this module never throws synchronously. The actual connection
 * (and the build-phase rejection) only happens when the promise is awaited.
 * This lets API routes and pages import the module during `next build` /
 * static generation without crashing, while still failing fast at runtime
 * when MongoDB genuinely is not available.
 */
class LazyMongoClientPromise {
  private _promise: Promise<MongoClient> | null = null;

  private ensure(): Promise<MongoClient> {
    if (!this._promise) {
      this._promise = getMongoClientPromise().catch((err) => {
        // Reset so a transient failure can be retried on the next call.
        this._promise = null;
        throw err;
      });
    }
    return this._promise;
  }

  then<T = MongoClient, R = never>(
    onfulfilled?: ((value: MongoClient) => T | PromiseLike<T>) | null,
    onrejected?: ((reason: any) => R | PromiseLike<R>) | null
  ): Promise<T | R> {
    return this.ensure().then(onfulfilled, onrejected);
  }

  catch<R = never>(
    onrejected?: ((reason: any) => R | PromiseLike<R>) | null
  ): Promise<MongoClient | R> {
    return this.ensure().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<MongoClient> {
    return this.ensure().finally(onfinally);
  }

  [Symbol.toStringTag] = 'Promise';
}

const clientPromise = new LazyMongoClientPromise();

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}

/** Establish connection and return DB. Call this at the start of API handlers so connection is ready before queries. */
export async function connectDB(): Promise<Db> {
  const client = await getMongoClientPromise();
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
  // Careers / recruitment
  JOBS: 'jobs',
  JOB_APPLICATIONS: 'applications',
  CANDIDATES: 'candidates',
  INTERVIEWS: 'interviews',
  CAREER_SETTINGS: 'careerSettings',
} as const;
