const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');
const Email = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      message,
      user
    }
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

  const activateToken = newUser.createActivateToken();
  await newUser.save({ validateBeforeSave: false });

  try {
    // const activateUrl = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/users/activateAccount/${activateToken}`;
    const activeUrl = `${req.protocol}://${req.get(
      'host'
    )}/activation/${activateToken}`;
    await new Email(newUser, activeUrl).sendConfirm();
    res.status(201).json({
      status: 'success',
      data: {
        message: 'Sign up successfully!🤗 Confirm your e-mail!📧'
      }
    });
  } catch (e) {
    await newUser.delete();
    return next(
      new Errors('Cannot send a message right now, please try again later!😢'),
      404
    );
  }
});

const activateAccount = catchAsync(async (req, res, next) => {
  const urlToken = req.params.token;

  // 1) Find user by the token and check
  const user = await User.findOne({
    activateToken: crypto
      .createHash('sha256')
      .update(urlToken)
      .digest('hex')
  });
  if (!user) return next(new Errors('Token is invalid 🙁', 400));

  user.active = true;
  user.activateToken = undefined;

  await user.save({ validateBeforeSave: false });

  const message = 'Now your account is active! Welcome 💜';

  createSendToken(user, 201, res, message);
});

//Request to login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(new Errors('Please input email and password!✍️', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password active');
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new Errors('Email and password are not correct! ☠️', 401));

  console.log(user.active);
  if (!user.active)
    return next(
      new Errors('Your account is not active, please check email! ☠️', 401)
    );

  const message = 'Login successful! Welcome 🏔';

  // 3) Send token to client which req
  createSendToken(user, 200, res, message);
});

//Request to logout user
const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new Errors('There is no user with this email!😢'), 404);

  const resetToken = user.createPassResToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Token sent to email!'
      }
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new Errors('Cannot send a message right now, please try again later!😢'),
      404
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const urlToken = req.params.token;

  // 1) Find user by the token and check
  const user = await User.findOne({
    passwordResetToken: crypto
      .createHash('sha256')
      .update(urlToken)
      .digest('hex'),
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) Check if token is right
  if (!user) return next(new Errors('Token is invalid or has expired🙁', 400));

  // 3) Change the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  // 4) Delete pass token and expires and save
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

const changePassword = catchAsync(async (req, res, next) => {
  // 1) Get user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (!(await bcrypt.compare(req.body.currentPassword, user.password)))
    return next(new Errors('This password is not correct'));

  // 3) Update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const message = '';

  // 4) Log user in, send JWT
  createSendToken(user, 200, res, message);
});

module.exports = {
  signUp,
  activateAccount,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};
