const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');
const User = require('../models/userModel');

//Check if user is logged
const protectRoute = catchAsync(async (req, res, next) => {
  // 1) Check is token is existing
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new Errors('You are not logged!😨'), 401);
  // 2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const isUserExists = await User.findById(decoded.id);
  if (!isUserExists)
    return next(
      new Errors(
        'The user belonging to this token does no longer exists!💀',
        401
      )
    );

  // 4) Check if user changed password after the token was issued
  if (isUserExists.passwordChangedAt) {
    // eslint-disable-next-line radix
    const changedTimestamp = parseInt(
      isUserExists.passwordChangedAt.getTime() / 1000,
      10
    );

    if (changedTimestamp > decoded.iat)
      return next(
        new Errors('Password was changed! Please log in again!!1!🙏', 401)
      );
  }

  //Create req.user to be available in next middleware
  req.user = isUserExists;
  next();
});

//Check if user has specific role
const restrictRoute = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new Errors('You do not have permission to get access', 401));
    next();
  };
};

//Check if user is currently logged
const isLoggedCurrently = catchAsync(async (req, res, next) => {
  // 1) Check is token is existing
  if (req.cookies.jwt) {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 3) Check if user still exists
    const isUserExists = await User.findById(decoded.id);
    if (!isUserExists) return next();

    // 4) Check if user changed password after the token was issued
    if (isUserExists.passwordChangedAt) {
      // eslint-disable-next-line radix
      const changedTimestamp = parseInt(
        isUserExists.passwordChangedAt.getTime() / 1000,
        10
      );

      if (changedTimestamp > decoded.iat) return next();
    }

    //Create req.user to be available in next middleware
    res.locals.user = isUserExists;
    return next();
  }
  next();
});

module.exports = {
  protectRoute,
  restrictRoute,
  isLoggedCurrently
};
