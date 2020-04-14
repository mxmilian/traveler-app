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

router
  .route('/')
  .get(readAllReview)
  .post(protectRoute, restrictRoute('user'), setReviewParam, createReview);

router
  .route('/:id')
  .get(readReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
