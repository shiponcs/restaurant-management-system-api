const User = require('../Models/userModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');

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
exports.deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(
    req.params.id
  );
  if (!deletedUser) {
    return next(
      new ApiError('No user found with that ID', 404)
    );
  }
  res.status(204).send(null);
});
exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  // check if email and password exist
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

  // If everything ok, send successful meassage
  res.status(200).json({
    status: 'success',
    message: 'Succesfully Logged In',
  });
});

exports.addNewUser = catchAsync(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: 'Success',
    data: {
      id: user._id,
    },
  });
});
