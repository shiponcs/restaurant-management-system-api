const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/apiError');
const ApiError = require('../utility/apiError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'Succesful',
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password!',
        400
      )
    );
  }
  // check if user exists & password is correct
  const user = await User.findOne({ email }).select(
    '+password'
  );

  if (
    !user ||
    !(await user.isCorrectPassword(password, user.password))
  ) {
    return next(
      new AppError('Incorrect email or password', 401)
    );
  }
  // If everything ok, end token to client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Gettring token and check of its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not loggin in! Please log in to get access',
        401
      )
    );
  }

  // verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new ApiError(
        'The user belonging to this token does no longer exits',
        401
      )
    );

  // Check if user changed password after the token wan issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError(
        'User recently changed password! please login again.',
        401
      )
    );
  }

  // Grant access to the protected route
  req.user = freshUser;
  next();
});
