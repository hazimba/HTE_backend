import { sql } from "../config/db.js";

export const getUser = async (req, res) => {
  try {
    const users = await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
    `;
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    console.log("Creating user with data:", req.body);
    await sql`
        INSERT INTO users (name, phone, email)
        VALUES (${name}, ${phone}, ${email})
        RETURNING *;
        `;
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
