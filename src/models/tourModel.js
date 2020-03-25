const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!👿'],
      unique: [true, 'This name is in used!🤭'],
      maxlength: [40, 'A tour must have less or equal then 40 characters!👿'],
      minlength: [10, 'A tour must have more or equal then 10 characters!👿'],
      trim: true
    },
    slug: String,
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
      required: [true, 'A tour must have a difficulty!👿'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be easy medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'A tour must have a ratings between 0 - 5!👿'],
      min: [0, 'A tour must have a ratings between 0 - 5!👿']
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
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
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

//Document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.name = slugify(this.name, {
    replacement: ' '
  });
  next();
});

//Query middleware: runs before query find findOne findOneAndDelete findOneAndRemove find OneAndUpdate...
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(doc, next) {
  console.log(`This query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregate middleware: runs before aggregate
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
