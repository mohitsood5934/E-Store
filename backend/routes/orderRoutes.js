const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  fetchMyOrders
} = require("../controllers/orderController");

const { verifyUser } = require("../controllers/userController");

router.post("/create", verifyUser, createOrder);
router.get("/my-orders", verifyUser,fetchMyOrders);
router.get("/:id", verifyUser, getOrderById);
router.put("/:id/pay", verifyUser, updateOrderToPaid);


module.exports = router;
