import { sql } from "../config/db.js";

export const getFavorites = async (req, res) => {
  const { id } = req.params;
  // console.log("Fetching favorites for user:", id);

  try {
    const favorite = await sql`
        SELECT * FROM favorite
        `;
    if (favorite.length === 0) {
      return res.status(404).json({ message: "No favorites found" });
    }
    res.status(200).json(favorite);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

export const getFavoritesByUserId = async (req, res) => {
  const { user_id } = req.params;
  // console.log("Fetching favorites for user:", user_id);
  try {
    const favorites = await sql`
        SELECT * FROM favorite WHERE user_id = ${user_id};
        `;
    // console.log("favorites123", favorites);
    // console.log("favorites123", favorites.length);
    if (favorites.length === 0) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user" });
    }
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites by user ID:", error);
    res.status(500).json({ error: "Failed to fetch favorites by user ID" });
  }
};

export const toggleFavorite = async (req, res) => {
  const { product_id, user_id } = req.body;

  try {
    const existing = await sql`
        SELECT * FROM favorite
        WHERE product_id = ${product_id} AND user_id = ${user_id}
      `;

    let result;
    if (existing.length > 0) {
      result = await sql`
          DELETE FROM favorite
          WHERE product_id = ${product_id} AND user_id = ${user_id}
          RETURNING *;
        `;
      res.status(200).json({ status: "removed", data: result[0] });
    } else {
      result = await sql`
          INSERT INTO favorite (product_id, user_id)
          VALUES (${product_id}, ${user_id})
          RETURNING *;
        `;
      res.status(200).json({ status: "added", data: result[0] });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error.message, error.stack);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
};
