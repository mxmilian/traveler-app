const User = require('../models/userModel');
const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Routes handlers
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'access',
    data: {
      users
    }
  });
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not implemented yet!'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not implemented yet!'
  });
};

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if user is trying to update password here
  if (req.body.password || req.body.confirmPassword)
    return next(new Errors('Cannot do this here!👿'), 401);

  // 3) Filter req
  const filterReq = filterObj(req.body, 'name', 'email');

  console.log(filterReq);

  // 2) Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    filterReq,
    {
      new: true,
      runValidators: true
    },
    () => {
      console.log('Updated!');
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not implemented yet!'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not implemented yet!'
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateMe,
  updateUser,
  deleteUser
};
