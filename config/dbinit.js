import { sql } from "../config/db.js";
import { seedUsers } from "./user/seedUsers.js";
import { seedProductTypes } from "./productTypes/seedProductTypes.js";

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS product_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(255) NOT NULL
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        years INTEGER NOT NULL,
        product_type_id INTEGER REFERENCES product_types(id) ON DELETE CASCADE,
        condition VARCHAR(50) NOT NULL,
        is_sold BOOLEAN NOT NULL DEFAULT false,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log("Database initialized successfully");

    await seedUsers();
    await seedProductTypes();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

initDB();
