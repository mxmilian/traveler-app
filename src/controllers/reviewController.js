const Review = require('../models/reviewModel');

const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne
} = require('./crudFactory');

const readAllReview = readAll(Review);

const setReviewParam = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createReview = createOne(Review);
const readReview = readOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

module.exports = {
  readAllReview,
  readReview,
  setReviewParam,
  createReview,
  updateReview,
  deleteReview
};
