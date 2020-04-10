const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  signUp,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');

const { protectRoute } = require('../middlewares/authProtect');
//one router for each of the resource
const router = express.Router();

//Mounting a new router on route
router.post('/signUp', signUp);
router.patch('/activateAccount/:token', activateAccount);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/changePassword', protectRoute, changePassword);

router.patch('/updateMe', protectRoute, updateMe);
router.delete('/deleteMe', protectRoute, deleteMe);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
