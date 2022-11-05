const Expense = require('../Models/expenseModel');
const ApiFeatures = require('../utility/apiFeatures');
const ApiError = require('../utility/apiError');
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

exports.thisMonthsExpense = catchAsync(
  async (req, res, next) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const thisMonthsExpense = await Expense.find({
      $and: [
        {
          date: {
            $gte: new Date(`${year}-${month + 1}-1`),
          },
        },
        {
          date: {
            $lt: new Date(
              `${year}-${month + 1}-${day + 1}`
            ),
          },
        },
      ],
    });
    if (!thisMonthsExpense) {
      return next(
        new ApiError(
          'No Expense found for this months!',
          400
        )
      );
    }

    res.status(200).json({
      status: 'success',
      results: thisMonthsExpense.length,
      data: {
        thisMonthsExpense,
      },
    });
  }
);

exports.todaysExpense = catchAsync(
  async (req, res, next) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const todaysExpense = await Expense.find({
      $and: [
        {
          date: {
            $gt: new Date(`${year}-${month + 1}-${day}`),
          },
        },
        {
          date: {
            $lt: new Date(
              `${year}-${month + 1}-${day + 1}`
            ),
          },
        },
      ],
    });
    if (!todaysExpense) {
      return next(
        new ApiError('No Expense found for today!', 400)
      );
    }

    res.status(200).json({
      status: 'success',
      results: todaysExpense.length,
      data: {
        todaysExpense,
      },
    });
  }
);
