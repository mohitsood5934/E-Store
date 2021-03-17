const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderToDelivered
} = require("../controllers/orderController");

const { verifyUser ,adminMiddleware } = require("../controllers/userController");

router.post("/create", verifyUser, createOrder);
router.get("/my-orders", verifyUser,fetchMyOrders);
router.get("/all-orders", verifyUser,adminMiddleware,fetchAllOrders);
router.get("/:id", verifyUser, getOrderById);
router.put("/:id/pay", verifyUser, updateOrderToPaid);
router.put("/:id/deliver", verifyUser, updateOrderToDelivered);

module.exports = router;
