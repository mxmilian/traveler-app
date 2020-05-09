const express = require('express');

const { getCheckoutSession } = require('../controllers/bookingController');

const {
  protectRoute /*restrictRoute*/
} = require('../middlewares/authProtect');

const router = express.Router();

router.get('/checkout-session/:tourID', protectRoute, getCheckoutSession);

module.exports = router;
