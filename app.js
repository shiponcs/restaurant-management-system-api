const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const ApiError = require('./utility/apiError');
const userRouter = require('./Routes/userRoutes');
const reservationRoutes = require('./Routes/reservationRoutes');
const itemRouter = require('./Routes/itemRoutes');
const expenseRoutes = require('./Routes/expenseRoutes');
const orderRouter = require('./Routes/orderRoutes');
const errorHandler = require('./Controller/errorController');
//Middleware
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'https://restaurent-point-of-sale.netlify.app',
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/reservation', reservationRoutes);
app.use('/api/items', itemRouter);
app.use('/api/expense', expenseRoutes);
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
