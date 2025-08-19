import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: dbUrl,
  },
});
