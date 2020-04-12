const express = require('express');

const {
  getAllReview,
  getReview,
  postReview,
  deleteReview
} = require('../controllers/reviewController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

const router = express.Router();

router
  .route('/')
  .get(getAllReview)
  .post(protectRoute, restrictRoute('user'), postReview);

router
  .route('/:id')
  .get(getReview)
  .delete(deleteReview);

module.exports = router;
