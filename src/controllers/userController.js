const User = require('../models/userModel');
const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');
const { createOne, readAll, readOne, updateOne, deleteOne } = require('./crudFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Routes handlers
const readAllUsers = readAll(User);
const readUser = readOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if user is trying to update password here
  if (req.body.password || req.body.confirmPassword)
    return next(new Errors('Cannot do this here!👿'), 401);

  // 3) Filter req
  const filterReq = filterObj(req.body, 'name', 'email');

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

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {
      data: null
    }
  });
});

//Controllers just for administrator
const createUser = createOne(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

module.exports = {
  readAllUsers,
  readUser,
  updateMe,
  deleteMe,
  createUser,
  updateUser,
  deleteUser
};
