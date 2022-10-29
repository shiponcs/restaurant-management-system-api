const express = require('express');
const morgan = require('morgan');

const app = express();
const ApiError = require('./utility/apiError');
const userRouter = require('./Routes/userRoutes');
const itemRouter = require('./Routes/itemRoutes');
const orderRouter = require('./Routes/orderRoutes');
const errorHandler = require('./Controller/errorController');
//Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);

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
