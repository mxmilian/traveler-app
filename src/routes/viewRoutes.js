const express = require('express');

const router = express.Router();

const { isLoggedCurrently } = require('../middlewares/authProtect');

const {
  getHome,
  getTours,
  getTour,
  getLogin
} = require('../controllers/viewController');

router.use(isLoggedCurrently);

router.get('/', getHome);
router.get('/tours', getTours);
router.get('/tours/:slug', getTour);
router.get('/login', getLogin);

module.exports = router;
