const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty must be added'],
  },
  maxGroupSize: {
    type: Number,
    required: [
      true,
      'A tour must have a Maximum group size',
    ],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'Summary must be added'],
    trim: true,
  },
  descripton: String,
  imageCover: {
    type: String,
    required: [true, 'Cover photo must be added'],
    trim: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  price: {
    type: Number,
    required: [true, 'Price must be added'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
