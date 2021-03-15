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

exports.adminMiddleware = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById({ _id: userId }, { _id: 0, isAdmin: 1 })
      .lean()
      .exec();
    if (user && user.isAdmin) {
      next();
    } else {
      return res.status(400).json({
        error: "Admin resource,access denied",
      });
    }
  } catch (error) {
    console.log(`Error occurred while checking for admin user ${error}`.red);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.signup = async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;
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
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
    });
    if (user) {
      const { isAdmin, _id } = user;
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1d" });

      return res.status(200).json({
        status: "success",
        token,
        user: { _id, name, email, isAdmin, mobileNumber },
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
      { name: 1, email: 1, isAdmin: 1, password: 1, mobileNumber: 1 }
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
      const { _id, name, email, isAdmin, mobileNumber } = user;
      //generate a JWT & send to client
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1d" });

      return res.status(200).json({
        status: "success",
        user: { _id, name, email, mobileNumber, isAdmin, token },
      });
    } else {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid  password" });
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
      { name: 1, email: 1, isAdmin: 1, mobileNumber: 1 }
    )
      .lean()
      .exec();

    if (user) {
      res.status(200).json({
        status: "success",
        user,
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

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(
      { _id: req.user._id },
      { name: 1, email: 1, isAdmin: 1, password: 1, mobileNumber: 1 }
    )
      .lean()
      .exec();

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobileNumber = req.body.mobileNumber || user.mobileNumber;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            name: user.name,
            email: user.email,
            mobileNUmber: user.mobileNUmber,
            password: user.password,
          },
        },
        { new: true }
      );

      const { _id } = updatedUser;
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expiresIn: "1m" });

      return res.status(200).json({
        status: "success",
        user: updatedUser,
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
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean().exec();
    return res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    console.log(`Error occurred while fetching the list of users ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const isUserExist = await User.exists({ _id: id });
    if (isUserExist) {
      await User.remove({ _id: id });
      return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "User not found",
      });
    }
  } catch (error) {
    console.log(`Error occurred while deleting the user ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(
      { _id: id },
      { _id: 1, name: 1, email: 1, mobileNumber: 1 }
    )
      .lean()
      .exec();
    if (user) {
      return res.status(200).json({
        status: "success",
        user,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "User not found",
      });
    }
  } catch (error) {
    console.log(`Error occurred while fetching the user by id ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, mobileNumber ,isAdmin} = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: id},
      { $set: { name: name, email: email, mobileNumber: mobileNumber,isAdmin:isAdmin } },
      {new:true}
    );
    if (user) {
      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
      });
    } else {
      return res.status(400).json({
        status: "failed",
        error: "User not found",
      });
    }
  } catch (error) {
    console.log(`Error occurred while updating the user ${error}`.red);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
