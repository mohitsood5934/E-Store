const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "error occurred while verifying token",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      error: "error,auth header not present",
    });
  }
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const isUserExist = await User.exists({ email });
    if (isUserExist) {
      return res.status(400).json({
        status: "failed",
        message: "User with this email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      const { isAdmin, _id } = user;
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1m" });

      return res.status(200).json({
        status: "success",
        token,
        user: { _id, name, email, isAdmin },
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "User creation failed",
      });
    }
  } catch (error) {
    console.log(`Error occurred while creating a user ${error}`.red);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne(
      { email },
      { name: 1, email: 1, isAdmin: 1, password: 1 }
    )
      .lean()
      .exec();
    if (!user) {
     return res.status(400).json({
        status: "failed",
        message: "User with this email does not exist.Please sign up!!",
      });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const { _id, name, email, isAdmin } = user;
      //generate a JWT & send to client
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1m" });

      return res.status(200).json({
        status: "success",
        user: { _id, name, email, isAdmin,token },
      });
    } else {
      return res.status(401).json({ status: "failed", message: "Invalid  password" });
    }
  } catch (error) {
    console.log(`Error occurred while logging in the user ${error}`.red);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(
      { _id: req.user._id },
      { name: 1, email: 1, isAdmin: 1, password: 1 }
    )
      .lean()
      .exec();

    if (user) {
      const { _id, name, email, isAdmin } = user;
      res.status(200).json({
        status: "success",
        user: { _id, name, email, isAdmin },
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "User not found",
      });
    }
  } catch (error) {
    console.log(
      `Error occurred while fetching profile of the user ${error}`.red
    );
    res.status(500).json({ status: "failed", message: error.message });
  }
};
