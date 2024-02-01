const userModel = require("../models/user");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
const jwb = require("jsonwebtoken");
const generateJwt = require("../utils/generateJwt");

const getUsers = asyncWrapper(async (req, res) => {
  const users = await userModel.find();
  res.json({ Status: httpStatusText.success, data: { users } });
});
const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await userModel.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.fail
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  const token = await generateJwt({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();
  res.json({ status: httpStatusText.success, data: { user: newUser } });
});
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "Email and password is required",
      400,
      httpStatusText.fail
    );
    return next(error);
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    const error = appError.create("User not found", 404, httpStatusText.fail);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJwt({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.json({ status: httpStatusText.success, data: { token } });
  } else {
    const error = appError.create(
      "Email or Password does not correct",
      500,
      httpStatusText.error
    );
    return next(error);
  }
});

const deleteUser = asyncWrapper(async (req, res) => {
    const userId = req.params.userId;

  if (req.user.role === "admin") {
    await userModel.deleteOne({_id: userId});
    res.json({ status: httpStatusText.success, data: null });
  } else {
    const error = appError.create(
      "You are not authorized",
      403,
      httpStatusText.error
    );
    return next(error);
  }
});

module.exports = {
  getUsers,
  register,
  login,
  deleteUser,
};
