const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');

const protectRoute = catchAsync(async (req, res, next) => {
  // 1) Check is token is existing
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new Errors('You are not logged!😨'), 401);
  // 2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) Check if user still exists

  // 4) Check if user changed password after the token was issued

  next();
});

module.exports = {
  protectRoute
};
