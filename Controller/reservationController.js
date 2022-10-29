const Reservation = require('../Models/reservationModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');
const { signToken } = require('./authController');

exports.createReservation = catchAsync(async (req, res) => {
    const reservation = await Reservation.create({
      clientName: req.body.clientName,
      people: req.body.people,
      reservationDate: req.body.reservationDate,
      contactNumber: req.body.contactNumber
    });
    res.status(201).json({
      status: 'success',
      message: 'reservation created succesfully',
      data: {
        reservation
      }
    });
  });
  

exports.getAllReservations = catchAsync(async (req, res, next) => {
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
});

exports.deletReservation = catchAsync(async (req, res, next) => {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation) {
      return next(
        new ApiError('No reservation found with this id!', 400)
      );
    }
    res.status(204).send(null);
  });

exports.updateReservation = catchAsync(async (req, res) => {
    const updatedReservation = await Reservation.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
    if(!updatedReservation) {
        return next(
            new ApiError('No reservation found with this id!', 400)
          );
    }
    res.status(200).json({
        status: 'success',
        data: {
            updatedReservation
        }
    });
});

// -------------------------------------------------------------------------------------------------

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Under Construction',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Under Construction',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(
    req.params.id
  );
  if (!deletedUser) {
    return next(
      new ApiError('No user exist with this ID!', 400)
    );
  }
  res.status(204).send(null);
});

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  // check if username and password is given in request
  if (!name || !password) {
    return next(
      new ApiError(
        'Please provide username and password!',
        400
      )
    );
  }
  // check if user exists & password is correct
  const user = await User.findOne({ name }).select(
    '+password'
  );

  if (
    !user ||
    !(await user.isCorrectPassword(password, user.password))
  ) {
    return next(
      new ApiError('Incorrect username or password', 401)
    );
  }

  // If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

