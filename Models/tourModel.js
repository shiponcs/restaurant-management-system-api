const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [
        10,
        'A Tour name should have minimum 10 character',
      ],
      maxlength: [
        40,
        "A Tour name shouldn't have more than 40 character",
      ],
      // validate: [
      //   validator.isAlpha,
      //   'Tour name should only contain characters',
      // ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty must be added'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty is either: easy, medium, difficult',
      },
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
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) should be less than regular price',
      },
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Can have multiple pre and post document middleware
// tourSchema.post('save', function(doc,next) {
//   console.log(doc);
//   next();
// })
// Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line no-console
  console.log(
    `Query took ${Date.now() - this.start} milisecond`
  );
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
