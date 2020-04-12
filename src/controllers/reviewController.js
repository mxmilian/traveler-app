const Review = require('../models/reviewModel');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');

const getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

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

const postReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview
    }
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      newReview
    }
  });
});

module.exports = {
  getAllReview,
  getReview,
  postReview,
  deleteReview
};
