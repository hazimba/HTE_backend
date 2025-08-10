import { sql } from "../config/db.js";

export const getProduct = async (req, res) => {
  console.log("Fetching products", req.query);
  const { user_id, condition, product_type_id, name } = req.query;

  try {
    let whereClauses = [];
    let params = [];

    if (user_id) {
      whereClauses.push(sql`user_id = ${user_id}`);
    }
    if (condition) {
      const typeArray = Array.isArray(condition)
        ? condition
        : condition.split(",");
      whereClauses.push(sql`condition = ANY(${typeArray})`);
    }
    if (product_type_id) {
      const typeArray = Array.isArray(product_type_id)
        ? product_type_id
        : product_type_id.split(",");
      whereClauses.push(sql`product_type_id = ANY(${typeArray})`);
    }
    if (name) {
      whereClauses.push(sql`name ILIKE ${"%" + name + "%"}`);
    }

    let query;
    if (whereClauses.length > 0) {
      const combinedWhere = whereClauses.reduce((acc, clause, idx) => {
        if (idx === 0) return clause;
        return sql`${acc} AND ${clause}`;
      });
      query = sql`SELECT * FROM products WHERE ${combinedWhere} ORDER BY created_at DESC`;
    } else {
      query = sql`SELECT * FROM products ORDER BY created_at DESC`;
    }

    console.log("Executing query:", query);
    const products = await query;

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
