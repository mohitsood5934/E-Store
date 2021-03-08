const express = require("express");
const router = express.Router();

const {
  findAllProducts,
  findProductById,
} = require("../controllers/productController");

router.get("/", findAllProducts);

router.get("/:id", findProductById);

module.exports = router;
