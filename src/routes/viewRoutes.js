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
  getMe
} = require('../controllers/viewController');

router.get('/', isLoggedCurrently, getHome);
router.get('/tours', isLoggedCurrently, getTours);
router.get('/tours/:slug', isLoggedCurrently, getTour);
router.get('/login', isLoggedCurrently, getLogin);
router.get('/register', isLoggedCurrently, getRegister);
router.get('/me', protectRoute, getMe);

module.exports = router;
