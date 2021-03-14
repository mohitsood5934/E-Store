const Order = require("../models/orderModel");
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    paymentMethod,
    shippingPrice,
    totalPrice,
  } = req.body;
  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        status: "failed",
        error: "No items present ",
      });
    } else {
      const order = new Order({
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        paymentMethod,
        shippingPrice,
        totalPrice,
        user: req.user._id,
      });

      const createdOrder = await order.save();
      res.status(201).json({ status: "success", createdOrder });
    }
  } catch (error) {
    console.log(`Error occurred while creating an order ${error}`.red);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findById({ _id: id })
      .populate("user", "name email mobileNumber")
      .lean()
      .exec();
    if (order) {
      return res.status(200).json({ status: "success", order });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "No order found with given order id ",
      });
    }
  } catch (error) {
    console.log(`Error occurred while fetching order by id ${id} ${error}`.red);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.updateOrderToPaid = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
          },
        },
      },
      {
        new: true,
      }
    )
      .populate("user", "name email mobileNumber")
      .lean()
      .exec();
    if (updatedOrder) {
      return res.status(200).json({ status: "success", updatedOrder });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "No order found with given order id ",
      });
    }
  } catch (error) {
    console.log(
      `Error occurred while updating order to paid having order id - ${id} ${error}`
        .red
    );
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.fetchMyOrders = async (req, res) => {
  console.log("i am here------------------------------")
  console.log("ddd",req.user._id)
  const userId = req.user._id;
  try {
    const orders = await Order.find({ user: mongoose.Types.ObjectId(userId) })
      .populate("user", "name email mobileNumber")
      .lean()
      .exec();
    if (orders) {
      return res.status(200).json({ status: "success", orders });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "No order found for the requested user ",
      });
    }
  } catch (error) {
    console.log(
      `Error occurred while fetching orders of the user with user id - ${userId} ${error}`
        .red
    );
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
