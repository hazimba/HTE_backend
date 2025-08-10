import express from "express";
import {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductFilteredByFavoriteUserId,
  getProductByUserId,
} from "../controller/product.js";

import {
  createProductType,
  getProductType,
  getProductTypeById,
} from "../controller/productType.js";

import {
  getUser,
  createUser,
  deleteUser,
  getUserById,
} from "../controller/user.js";

import {
  getFavorites,
  toggleFavorite,
  getFavoritesByUserId,
} from "../controller/favorite.js";

const router = express.Router();

// product
router.route("/product").get(getProduct).post(createProduct);
router.route("/product/user/:id").get(getProductByUserId);
router.route("/product/filter").post(getProductFilteredByFavoriteUserId);
router.route("/product/:id").delete(deleteProduct).patch(updateProduct);

// product type
router.route("/productType").get(getProductType).post(createProductType);
router.route("/productType/:id").get(getProductTypeById);

// user
router.route("/user").get(getUser).post(createUser);
router.route("/user/:id").delete(deleteUser).get(getUserById);

// favorite
router.route("/favorite/toggle").post(toggleFavorite);
router.route("/favorite").get(getFavorites);
router.route("/favorite/user/:user_id").get(getFavoritesByUserId);

export default router;
