import express from "express";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.js";

const router = express.Router();

router.route("/").get(getProduct).post(createProduct); // GET /api/products POST /api/products
router.route("/:id").delete(deleteProduct).patch(updateProduct); // DELETE /api/products/:id PATCH /api/products/:id

export default router;
