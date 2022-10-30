const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const ApiError = require('../utility/apiError');

exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.protect = catchAsync(async (req, res, next) => {
  // Gettring token and check of its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ApiError(
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
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new ApiError(
        'The user belonging to this token does no longer exits',
        401
      )
    );

  // Grant access to the protected route
  req.user = currentUser;
  next();
});

exports.restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new ApiError(
        'You do not have permission to perform this action',
        403
      )
    );
  }
  next();
};
