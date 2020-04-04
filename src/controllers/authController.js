const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//Creating a new user
const signUp = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: newUser
    }
  });
});

//Request to login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new Errors('Please input email and password!✍️', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new Errors('Email and password are not correct! ☠️', 401));

  // 3) Send token to client which req
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  });
});

module.exports = {
  signUp,
  login
};
