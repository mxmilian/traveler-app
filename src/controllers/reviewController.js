const Review = require('../models/reviewModel');
const catchAsync = require('../errors/catchAsync');

const { createOne, updateOne, deleteOne } = require('./handlerFactory');

const getAllReview = catchAsync(async (req, res, next) => {
  //Nested routes
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

const setReviewParam = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

module.exports = {
  getAllReview,
  getReview,
  setReviewParam,
  createReview,
  updateReview,
  deleteReview
};
