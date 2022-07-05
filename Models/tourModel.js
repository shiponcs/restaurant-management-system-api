const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour name is required'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'Price must be added'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
