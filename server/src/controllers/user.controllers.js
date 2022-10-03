const asyncHandler = require("express-async-handler");
const tokenUtils = require("../../utils/token-utils");
const User = require("../models/user.models");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = tokenUtils.generateToken(user.id);

  return res.send({
    success: true,
    message: "User registered successfully.",
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    roles: user.roles,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send({
      success: false,
      message: "User not found",
    });
  }

  // console.log(user.password);
  // console.log(req.body.password);

  if (user.password !== req.body.password) {
    return res.send({
      success: false,
      message: "Password incorrect",
    });
  }

  const token = tokenUtils.generateToken(user.id);

  return res.send({
    success: true,
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    roles: user.roles,
    token,
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {});

const getAllUsers = asyncHandler(async (req, res) => {
  console.log(req.query);
  const keyword = req.query.search
    ? {
        $or: [
          { email: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // find all users matching the keyword except the logged in user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  return res.send({
    success: true,
    message: "Users found",
    users,
  });
});

const userController = { register, login, uploadAvatar, getAllUsers };

module.exports = userController;
