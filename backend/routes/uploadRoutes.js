const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");

router.post("/:id/image", uploadImage);

module.exports = router;
