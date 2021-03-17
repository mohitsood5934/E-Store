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

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const isProductExist = await Product.exists({ _id: id });
    if (isProductExist) {
      await Product.remove({ _id: id });
      return res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "Product not found",
      });
    }
  } catch (error) {
    console.log(`Error occurred while deleting the product ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const product = new Product({
    name: "sample",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });
  try {
    const createdProduct = await product.save();
    return res.status(201).json({
      status: 'success',
      createdProduct,
    });
  } catch (error) {
    console.log(`Error occurred while creating the product ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  try {
    const product = await Product.exists({ _id: productId });
    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productId },
        {
          $set: {
            name: name,
            price: price,
            description: description,
            image: image,
            brand: brand,
            category: category,
            countInStock: countInStock,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        status: "success",
        updatedProduct,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "Product not found",
      });
    }
  } catch (error) {
    console.log(`Error occurred while creating the product ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
