import fs from "fs";
import { sql } from "../db.js";

export async function seedProductTypes() {
  // Read product types from JSON file and insert them into the database
  // This is a one-time operation to populate the product_types table
  // Ensure the JSON file exists and contains valid data
  try {
    const productTypes = JSON.parse(
      fs.readFileSync("config/productTypes/product_types.json", "utf-8")
    );

    for (const type of productTypes) {
      await sql`
        INSERT INTO product_types (name, category)
        VALUES (${type.name}, ${type.category})
        ON CONFLICT (name) DO NOTHING; -- Prevents duplicate entries
      `;
    }
    console.log("Product types seeded successfully");
  } catch (error) {
    console.error("Error seeding product types:", error);
  }
}

seedProductTypes();
