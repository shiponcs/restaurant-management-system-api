const User = require('../Models/userModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Query
  const userQuery = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .pagination();
  // Execute query
  const users = await userQuery.query;
  // Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
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
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Under Construction',
  });
};
exports.addNewUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Under Construction',
  });
};
