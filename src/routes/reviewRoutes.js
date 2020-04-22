const express = require('express');

const {
  readAllReview,
  readReview,
  createReview,
  setReviewParam,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router
  .route('/')
  .get(readAllReview)
  .post(restrictRoute('user'), setReviewParam, createReview);

router
  .route('/:id')
  .get(readReview)
  .patch(restrictRoute('user', 'admin'), updateReview)
  .delete(restrictRoute('user', 'admin'), deleteReview);

module.exports = router;
