import { sql } from "../config/db.js";

// just straight forward CRUD operations for users
// no complex logic, just basic operations
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

// macam tak pakai but lazy to check just push as long it works
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req, res) => {
  try {
    console.log("Received request to create user:", req.body);
    const { name, phone, email, change_role_request, role } = req.body;

    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;
    console.log("Existing user check result:", existingUser);
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Creating user with data:", req.body);
    await sql`
        INSERT INTO users (name, phone, email, change_role_request, role)
        VALUES (${name}, ${phone}, ${email}, ${change_role_request}, ${role})
        RETURNING *;
        `;
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  const { name, phone, email, change_role_request, role } = req.body;
  console.log("req.body", req.body);
  try {
    const result = await sql`
      UPDATE users
      SET name = ${name}, phone = ${phone}, email = ${email}, change_role_request = ${change_role_request}, role = ${role}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: result[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getUserById = async (req, res) => {
  const { id, email } = req.params;

  try {
    const user = await sql`
      SELECT * FROM users WHERE id = ${id};
    `;

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
