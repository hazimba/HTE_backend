import { sql } from "../config/db.js";

export const getProduct = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      years,
      product_type_id,
      condition,
      is_sold,
      user_id,
    } = req.body;

    console.log("Creating product with data:", req.body);
    await sql`
      INSERT INTO products (name, description, price, years, product_type_id, condition, is_sold, user_id)
      VALUES (${name}, ${description}, ${price}, ${years}, ${product_type_id}, ${condition}, ${is_sold}, ${user_id});
    `;
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = (req, res) => {
  // Logic to update a Product
  res.json({ message: "Product updated successfully" });
};

export const deleteProduct = (req, res) => {
  // Logic to delete a Product
  res.json({ message: "Product deleted successfully" });
};
