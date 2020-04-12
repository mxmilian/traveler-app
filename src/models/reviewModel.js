const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must have a description!👿'],
      maxlength: [40, 'Review must have less or equal then 40 characters!👿'],
      minlength: [10, 'Review must have more or equal then 10 characters!👿']
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating!👿'],
      max: [5, 'A tour must have a ratings between 0 - 5!👿'],
      min: [0, 'A tour must have a ratings between 0 - 5!👿']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belongs to a tour!👿']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author!👿']
    }
  },
  {
    timestamp: true
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
