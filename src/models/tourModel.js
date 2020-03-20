const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!👿'],
    unique: [true, 'This name is in used!🤭']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!👿']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
