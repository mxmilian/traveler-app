const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!👿'],
    unique: [true, 'This name is in used!🤭'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration!👿']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size!👿']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty!👿']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!👿']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A tour must have a description!👿'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image!👿']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
