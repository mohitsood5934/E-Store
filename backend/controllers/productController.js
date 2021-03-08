const colors = require("colors");
const Product = require("../models/productModel");

exports.findAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean().exec();

    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.log(
      `Error occurred while fetching all products ${error.message}`.red
    );
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).lean().exec();
    if (product) {
      res.status(200).json({ status: "success", product });
    } else {
      res.status(404).json({ status: "failed", message: "Product not found" });
    }
  } catch (error) {
    console.log(`Error occurred while fetching product by its id ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
