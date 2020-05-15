const express = require('express');

const {
  getCheckoutSession,
  readAllBookings,
  readBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

const router = express.Router();

router.use(protectRoute);

router.get('/checkout-session/:tourID', getCheckoutSession);

router.use(restrictRoute('admin', 'moderator'));

router
  .route('/')
  .get(readAllBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(readBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
