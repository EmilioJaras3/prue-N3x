import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/restructurado/backend/infrastructure/database/services/schema';
import { env } from '@/restructurado/backend/infrastructure/security/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
