const express = require('express');
const {
  readAllUsers,
  readUser,
  createUser,
  readMe,
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

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');
//one router for each of the resource
const router = express.Router();

//Mounting a new router on route
router.post('/signUp', signUp);
router.patch('/activateAccount/:token', activateAccount);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protectRoute);

router.patch('/changePassword', changePassword);
router.patch('/updateMe', updateMe);
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
