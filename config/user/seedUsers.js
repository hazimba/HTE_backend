import fs from "fs";
import { sql } from "../db.js";

export async function seedUsers() {
  try {
    const users = JSON.parse(
      fs.readFileSync("config/user/users.json", "utf-8")
    );

    for (const user of users) {
      await sql`
        INSERT INTO users (name, phone, email)
        VALUES (${user.name}, ${user.phone}, ${user.email})
        ON CONFLICT (email) DO NOTHING; -- Prevents duplicate entries
      `;
    }
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

seedUsers();
