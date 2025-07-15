import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle', // path to migrations
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    port: 5435,
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'assistant',
    ssl: false
  }
});
