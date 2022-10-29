const express = require('express');

const router = express.Router();
const authController = require('../Controller/authController');
const expenseController = require('../Controller/expenseController');

router.post(
  '/create-expense',
//   authController.protect,
  expenseController.createExpense
);
// router.get(
//     '/',
//     authController.protect,
//     expenseController.getAllExpenses
// )
// router
//     .route('/:id')
//     .delete(
//         authController.protect,
//         expenseController.deletReservation
//     )
//     .patch(
//         authController.protect,
//         expenseController.updateReservation
//         );


module.exports = router;
