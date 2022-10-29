const Expense = require('../Models/expenseModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');
const { signToken } = require('./authController');

exports.createExpense = catchAsync(async (req, res) => {
    const expense = await Expense.create({
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        date: req.body.date
    });
    res.status(201).json({
      status: 'success',
      message: 'Expense created succesfully',
      data: {
        expense
      }
    });
});

exports.getAllExpenses = catchAsync(async (req, res, next) => {
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
});

// ----------------


// exports.createReservation = catchAsync(async (req, res) => {
//     const reservation = await Reservation.create({
//       clientName: req.body.clientName,
//       people: req.body.people,
//       reservationDate: req.body.reservationDate,
//       contactNumber: req.body.contactNumber
//     });
//     res.status(201).json({
//       status: 'success',
//       message: 'reservation created succesfully',
//       data: {
//         reservation
//       }
//     });
//   });
  

// exports.getAllReservations = catchAsync(async (req, res, next) => {
//   // Query
//   const reservationQuery = new ApiFeatures(
//     Reservation.find(),
//     req.query
//   )
//     .filter()
//     .sort()
//     .pagination();
//   // Execute query
//   const reservations = await reservationQuery.query;
//   // Send Response
//   res.status(200).json({
//     status: 'success',
//     results: reservations.length,
//     data: {
//       reservations,
//     },
//   });
// });

// exports.deletReservation = catchAsync(async (req, res, next) => {
//     const deletedReservation = await Reservation.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedReservation) {
//       return next(
//         new ApiError('No reservation found with this id!', 400)
//       );
//     }
//     res.status(204).send(null);
//   });

// exports.updateReservation = catchAsync(async (req, res) => {
//     const updatedReservation = await Reservation.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
//     if(!updatedReservation) {
//         return next(
//             new ApiError('No reservation found with this id!', 400)
//           );
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             updatedReservation
//         }
//     });
// });