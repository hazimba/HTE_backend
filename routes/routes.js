import express from "express";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.js";

const router = express.Router();

router.get("/getProduct", getProduct);
router.post("/createProduct", createProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.patch("/updateProduct/:id", updateProduct);

export default router;
