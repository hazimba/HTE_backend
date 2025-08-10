import { sql } from "../config/db.js";

export const getProduct = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;
    if (products.length === 0) {
      return res.status(404).json({ message: "No productss found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      SELECT * FROM products WHERE user_id = ${id} 
      ORDER BY created_at DESC
    `;
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to fetch product" });
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

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    years,
    product_type_id,
    condition,
    is_sold,
  } = req.body;

  try {
    const result = await sql`
      UPDATE products
      SET name = ${name}, description = ${description}, price = ${price}, years = ${years}, product_type_id = ${product_type_id}, condition = ${condition}, is_sold = ${is_sold}
      WHERE id = ${id};
    `;

    if (result.count === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      DELETE FROM products WHERE id = ${id};
    `;

    if (result.count === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const getProductFilteredByFavoriteUserId = async (req, res) => {
  try {
    const { name, product_type_id, condition, favorite, user_id } = req.body;

    let query;

    if (favorite) {
      query = sql`
        SELECT p.* 
        FROM products p
        INNER JOIN favorite f ON f.product_id = p.id AND f.user_id = ${user_id}
        WHERE 1=1
      `;
    } else {
      // All products
      query = sql`
        SELECT p.* 
        FROM products p
        WHERE 1=1
      `;
    }

    if (name && name.trim() !== "") {
      query = sql`${query} AND p.name ILIKE ${"%" + name.trim() + "%"}`;
    }

    if (product_type_id && product_type_id !== "") {
      query = sql`${query} AND p.product_type_id = ${product_type_id}`;
    }

    if (
      condition &&
      ((Array.isArray(condition) && condition.length > 0) ||
        typeof condition === "string")
    ) {
      const condArray = Array.isArray(condition) ? condition : [condition];
      query = sql`${query} AND p.condition = ANY(${condArray})`;
    }

    query = sql`${query} ORDER BY p.created_at DESC`;

    const products = await query;

    return res.status(200).json(products);
  } catch (err) {
    console.error("Error filtering products:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
