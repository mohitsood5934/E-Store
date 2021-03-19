const express = require("express");
const router = express.Router();

const {
  findAllProducts,
  findProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts
} = require("../controllers/productController");

const {
  verifyUser,
  adminMiddleware,
} = require("../controllers/userController");

router.get("/", findAllProducts);
router.get("/top",verifyUser,getTopProducts);
router.post("/create", verifyUser, adminMiddleware, createProduct);
router.get("/:id", findProductById);
router.put("/:id", verifyUser, adminMiddleware, updateProduct);
router.delete("/:id", verifyUser, adminMiddleware, deleteProduct);
router.post("/:id/reviews", verifyUser, createProductReview);


module.exports = router;
