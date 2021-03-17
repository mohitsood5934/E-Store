const express = require("express");
const router = express.Router();

const {
  findAllProducts,
  findProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const {verifyUser,adminMiddleware} = require("../controllers/userController");

router.get("/", findAllProducts);
router.post("/create", verifyUser,adminMiddleware,createProduct);
router.get("/:id", findProductById);
router.put("/:id",verifyUser,adminMiddleware, updateProduct);
router.delete("/:id",verifyUser,adminMiddleware, deleteProduct);

module.exports = router;
