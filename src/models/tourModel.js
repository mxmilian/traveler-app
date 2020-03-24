const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
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
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  const weeks = (this.duration / 7).toFixed(1).split('.');
  let weekString;
  if (weeks[0] !== '0' && weeks[1] !== '0') {
    weekString = `${weeks[0]} week and ${weeks[1]} days`;
  } else if (weeks[0] !== '0' && weeks[1] === '0') {
    weekString = `${weeks[0]} weeks`;
  } else {
    weekString = `${weeks[1]} days`;
  }
  return weekString;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
