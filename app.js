const express = require('express');

const morgan = require('morgan');

const app = express();
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

//Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
