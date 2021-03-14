const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyUser,
  adminMiddleware,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");

router.get("/", verifyUser, getUsers);
router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyUser, adminMiddleware, getUserProfile);
router.put("/profile", verifyUser, updateUserProfile);

router.get("/:id",verifyUser,adminMiddleware,getUserById);
router.put("/:id", verifyUser, adminMiddleware, updateUser);
router.delete("/:id", verifyUser, adminMiddleware, deleteUser);

module.exports = router;
