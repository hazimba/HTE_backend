import { sql } from "../config/db.js";

// just straight forward CRUD operations for product types
// no complex logic, just basic operations
export const createProductType = async (req, res) => {
  console.log("req.body", req.body);
  const { name, category } = req.body;

  try {
    await sql`
      INSERT INTO product_types (name, category)
      VALUES (${name}, ${category})
      RETURNING *;
    `;
    res.status(201).json({ message: "Product type created successfully" });
  } catch (error) {
    console.error("Error creating product type:", error);
    res.status(500).json({ error: "Failed to create product type" });
  }
};

export const getProductType = async (req, res) => {
  try {
    const productTypes = await sql`
      SELECT * FROM product_types;
      `;

    if (productTypes.length === 0) {
      return res.status(404).json({ message: "No product types found" });
    }
    res.status(200).json(productTypes);
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ error: "Failed to fetch product types" });
  }
};

export const getProductTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const productType = await sql`
      SELECT * FROM product_types WHERE id = ${id};
    `;

    if (productType.length === 0) {
      return res.status(404).json({ message: "Product type not found" });
    }
    res.status(200).json(productType[0]);
  } catch (error) {
    console.error("Error fetching product type:", error);
    res.status(500).json({ error: "Failed to fetch product type" });
  }
};
