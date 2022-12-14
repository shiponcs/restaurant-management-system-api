const Reservation = require('../Models/reservationModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');

exports.createReservation = catchAsync(async (req, res) => {
  const reservation = await Reservation.create({
    clientName: req.body.clientName,
    people: req.body.people,
    reservationDate: req.body.reservationDate,
    contactNumber: req.body.contactNumber,
  });
  res.status(201).json({
    status: 'success',
    message: 'reservation created succesfully',
    data: {
      reservation,
    },
  });
});

exports.getAllReservations = catchAsync(
  async (req, res, next) => {
    // Query
    const reservationQuery = new ApiFeatures(
      Reservation.find(),
      req.query
    )
      .filter()
      .sort()
      .pagination();
    // Execute query
    const reservations = await reservationQuery.query;
    // Send Response
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations,
      },
    });
  }
);

exports.deletReservation = catchAsync(
  async (req, res, next) => {
    const deletedReservation =
      await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return next(
        new ApiError(
          'No reservation found with this id!',
          400
        )
      );
    }
    res.status(204).send(null);
  }
);

exports.updateReservation = catchAsync(
  async (req, res, next) => {
    const updatedReservation =
      await Reservation.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
    if (!updatedReservation) {
      return next(
        new ApiError(
          'No reservation found with this id!',
          400
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedReservation,
      },
    });
  }
);

exports.todaysReservation = catchAsync(
  async (req, res, next) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const todaysReservation = await Reservation.find({
      $and: [
        {
          reservationDate: {
            $gte: new Date(`${year}-${month + 1}-${day}`),
          },
        },
        {
          reservationDate: {
            $lt: new Date(
              `${year}-${month + 1}-${day + 1}`
            ),
          },
        },
      ],
    });
    if (!todaysReservation) {
      return next(
        new ApiError('No reservation found for today!', 400)
      );
    }

    res.status(200).json({
      status: 'success',
      results: todaysReservation.length,
      data: {
        todaysReservation,
      },
    });
  }
);
