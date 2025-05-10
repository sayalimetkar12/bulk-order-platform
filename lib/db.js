import 'dotenv/config'; //This loads .env
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);