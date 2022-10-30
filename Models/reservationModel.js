const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const reservationScheme = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'client must have a name'],
    trim: true,
  },
  reservationDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  people: {
    type: Number,
    default: 0,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  }
});


const Reservation = mongoose.model('Reservation', reservationScheme);

module.exports = Reservation;
