const User = require('../Models/userModel');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');
const { signToken } = require('./authController');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Query
  const userQuery = new ApiFeatures(
    User.find({ isAdmin: false }),
    req.query
  )
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
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

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
      username: user.name,
    },
  });
});
