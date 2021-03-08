const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyUser,
  getUserProfile,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", verifyUser, getUserProfile);

module.exports = router;
