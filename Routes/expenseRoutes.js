const express = require('express');

const router = express.Router();
const authController = require('../Controller/authController');
const expenseController = require('../Controller/expenseController');

router.post(
  '/create-expense',
  authController.protect,
  expenseController.createExpense
);
router.get(
  '/',
  authController.protect,
  expenseController.getAllExpenses
);

router.get(
  '/this-months-expense',
  authController.protect,
  expenseController.thisMonthsExpense
);

router.get(
  '/todays-expense',
  authController.protect,
  expenseController.todaysExpense
);

module.exports = router;
