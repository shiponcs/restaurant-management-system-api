const ApiError = require('../utility/apiError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational, trusted error: send to the client
  if (err.isOperationError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown error: don't inform the error details to the client
  } else {
    // 1) Log error
    // eslint-disable-next-line no-console
    console.log('Error :', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new ApiError(message, 400);
};

const handleDuplicateErrorDB = (err, req) => {
  const message = `Duplicate field value : '${req.body.name}'. Please use another value`;
  return new ApiError(message, 400);
};

const handleValidatonError = (err) => {
  const errors = Object.values(err.errors).map(
    (element) => element.message
  );
  const message = `Invalid input data. ${errors.join(
    '. '
  )}`;
  return new ApiError(message, 400);
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error, req);
    }
    if (error.name === 'ValidationError') {
      error = handleValidatonError(error);
    }
    sendErrorProd(error, res);
  }
};
