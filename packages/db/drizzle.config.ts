import { config } from "dotenv";

config();

export default {
  schema: "./src/schema.ts",
  out: "./drizzle", // path to migrations
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
  breakpoints: true,
};
