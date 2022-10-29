const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCreatedAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Every Order must have a total price'],
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    required: [
      true,
      'Every order must have a paid/unpaid status',
    ],
  },
  items: [
    {
      _id: false,
      item: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Item',
        required: [true, 'Order must have a item'],
        _id: false,
      },
      quantity: Number,
    },
  ],
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.item',
    select: 'name price -_id',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
