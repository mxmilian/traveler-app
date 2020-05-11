const express = require('express');

const router = express.Router();

const {
  isLoggedCurrently,
  protectRoute
} = require('../middlewares/authProtect');

const {
  getHome,
  getTours,
  getTour,
  getLogin,
  getRegister,
  getMe,
  getMyTours
} = require('../controllers/viewController');

//TEMPORARY!
const { createBookingCheckout } = require('../controllers/bookingController');

router.get('/', isLoggedCurrently, createBookingCheckout, getHome);
router.get('/tours', isLoggedCurrently, getTours);
router.get('/tours/:slug', isLoggedCurrently, getTour);
router.get('/login', isLoggedCurrently, getLogin);
router.get('/register', isLoggedCurrently, getRegister);
router.get('/me', protectRoute, getMe);
router.get('/my-tours', protectRoute, getMyTours);

module.exports = router;
