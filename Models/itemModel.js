const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item must have a name'],
    trim: true,
    unique: true,
  },
  catagory: {
    type: String,
    enum: {
      values: [
        'others',
        'Bengali',
        'Indian',
        'Chinese',
        'Arabian',
        'Thai',
        'Mexican',
      ],
      message: 'There must have a catagory',
    },
    default: 'others',
  },
  price: {
    type: Number,
    require: [true, 'There must have a price for the item'],
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
