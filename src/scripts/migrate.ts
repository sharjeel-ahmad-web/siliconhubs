/**
 * Database migration script
 *
 * Run this script to initialize or update the database schema:
 * npx tsx scripts/migrate.ts
 */

import { initializeDatabase } from '../lib/db/connection';

async function migrate() {
  console.log('Starting database migration...');

  try {
    await initializeDatabase();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
