import { sql } from '@vercel/postgres';

/**
 * Database connection utility using Vercel Postgres
 *
 * This module provides a simple interface to interact with the Vercel Postgres database.
 * The connection is automatically configured using environment variables:
 * - POSTGRES_URL
 * - POSTGRES_PRISMA_URL
 * - POSTGRES_URL_NON_POOLING
 * - POSTGRES_USER
 * - POSTGRES_HOST
 * - POSTGRES_PASSWORD
 * - POSTGRES_DATABASE
 */

export { sql };

/**
 * Execute a database query
 * @param query SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  try {
    const result = await sql.query(query, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Initialize database schema
 * This should be run once during deployment
 */
export async function initializeDatabase() {
  try {
    // Read and execute schema.sql
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    await sql.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
