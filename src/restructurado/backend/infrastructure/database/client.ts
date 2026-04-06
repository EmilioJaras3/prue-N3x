import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/restructurado/backend/infrastructure/database/services/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no esta definida');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
