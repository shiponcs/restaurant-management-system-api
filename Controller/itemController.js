const Item = require('../Models/itemModel');
const catchAsync = require('../utility/catchAsync');
const ApiFeatures = require('../utility/apiFeatures');
const ApiError = require('../utility/apiError');

exports.addItem = catchAsync(async (req, res, next) => {
  const item = await Item.create({
    name: req.body.name,
    catagory: req.body.catagory,
    price: req.body.price,
  });

  res.status(201).json({
    status: 'Success',
    data: {
      item,
    },
  });
});
exports.getAllItems = catchAsync(async (req, res, next) => {
  const itemQuery = new ApiFeatures(Item.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .pagination();
  // Execute query
  const items = await itemQuery.query;
  // Send Response
  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      items,
    },
  });
});
exports.updateItem = catchAsync(async (req, res, next) => {
  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedItem) {
    return next(
      new ApiError('No item found with that ID', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedItem,
    },
  });
});
exports.deleteItem = catchAsync(async (req, res, next) => {
  const deletedItem = await Item.findByIdAndDelete(
    req.params.id
  );
  if (!deletedItem) {
    return next(
      new ApiError('No item exist with this ID!', 400)
    );
  }
  res.status(204).send(null);
});
