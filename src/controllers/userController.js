const User = require('../models/userModel');
//const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');

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
  updateUser,
  deleteUser
};
