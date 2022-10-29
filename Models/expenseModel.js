const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: {
      values: [
        'Snacks',
        'Salary',
        'Rent',
        'Accessories',
        'Raw materials',
        'others',
      ],
      message: 'There must have a category',
    },
    default: 'others',
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: [0, "The value is too low to be a price"],
    required: [true, 'Each expense must have a price.'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
});

// Category, description,price,date

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
