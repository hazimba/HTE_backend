import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

// Create a connection to the Neon database using environment variables
// Ensure that the environment variables are set correctly in your .env file
export const sql = postgres(
  `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
