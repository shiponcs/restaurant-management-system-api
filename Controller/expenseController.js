const Expense = require('../Models/expenseModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');

exports.createExpense = catchAsync(async (req, res) => {
  const expense = await Expense.create({
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    date: req.body.date,
  });
  res.status(201).json({
    status: 'success',
    message: 'Expense created succesfully',
    data: {
      expense,
    },
  });
});

exports.getAllExpenses = catchAsync(
  async (req, res, next) => {
    // Query
    const expenseQuery = new ApiFeatures(
      Expense.find(),
      req.query
    )
      .filter()
      .sort()
      .pagination();
    // Execute query
    const expenses = await expenseQuery.query;
    // Send Response
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: {
        expenses,
      },
    });
  }
);
