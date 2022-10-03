const express = require('express');
const morgan = require('morgan');

const app = express();
const ApiError = require('./utility/apiError');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const errorHandler = require('./Controller/errorController');
//Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  //console.log(req.headers);
  next();
});
// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new ApiError(
      `Can't find the ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(errorHandler);

module.exports = app;
