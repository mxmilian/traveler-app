const express = require('express');

const {
  readAllUsers,
  readUser,
  createUser,
  readMe,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  uploadPhoto
} = require('../controllers/userController');

const {
  signUp,
  activateAccount,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');

//one router for each of the resource
const router = express.Router();
router.patch('/activateAccount/:token', activateAccount);

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

//Mounting a new router on route
router.post('/signUp', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protectRoute);

router.patch('/changePassword', changePassword);
router.patch('/updateMe', uploadPhoto, updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', readMe, readUser);

router.use(restrictRoute('admin'));

router
  .route('/')
  .get(readAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
