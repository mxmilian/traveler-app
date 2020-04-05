const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');
const sendEmail = require('../utils/email');

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

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new Errors('There is no user with this email!😢'), 404);

  const resetToken = user.createPassResToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your password 🧐 (10 minutes)',
      message: `Reset your password by clicking here ${resetURL}.`
    });

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Token sent to email!'
      }
    });
  } catch (e) {
    console.log(e);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new Errors('Cannot send a message right now, please try again later!😢'),
      404
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {});

module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword
};
