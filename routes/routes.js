import express from "express";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.js";

import {
  createProductType,
  getProductType,
} from "../controller/productType.js";

import { getUser, createUser } from "../controller/user.js";

const router = express.Router();

router.route("/product").get(getProduct).post(createProduct); // GET /api/products POST /api/products
router.route("/product/:id").delete(deleteProduct).patch(updateProduct); // DELETE /api/products/:id PATCH /api/products/:id

router.route("/productType").get(getProductType).post(createProductType);

router.route("/user").get(getUser).post(createUser);

export default router;
