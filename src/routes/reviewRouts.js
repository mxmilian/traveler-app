const express = require('express');

const {
  getAllReview,
  getReview,
  createReview,
  setReviewParam,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protectRoute, restrictRoute('user'), setReviewParam, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
