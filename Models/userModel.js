const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please create a password'],
    trim: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the paaword'],
    trim: true,
  },
  photo: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
