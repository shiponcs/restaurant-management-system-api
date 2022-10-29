const Order = require('../Models/orderModel');
const catchAsync = require('../utility/catchAsync');
const ApiFeatures = require('../utility/apiFeatures');
const ApiError = require('../utility/apiError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      order,
    },
  });
});

exports.getAllOrders = catchAsync(
  async (req, res, next) => {
    const orderQuery = new ApiFeatures(
      Order.find(),
      req.query
    )
      .filter()
      .sort()
      .selectFields()
      .pagination();
    // Execute query
    const orders = await orderQuery.query;
    // Send Response
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  }
);
exports.updateOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedOrder) {
    return next(
      new ApiError('No order found with that ID', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedOrder,
    },
  });
});
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const deletedOrder = await Order.findByIdAndDelete(
    req.params.id
  );
  if (!deletedOrder) {
    return next(
      new ApiError('No order exist with this ID!', 400)
    );
  }
  res.status(204).send(null);
});
