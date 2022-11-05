const express = require('express');

const router = express.Router();
const authController = require('../Controller/authController');
const reservationController = require('../Controller/reservationController');

router.post(
  '/create-reservation',
  authController.protect,
  reservationController.createReservation
);
router.get(
  '/',
  authController.protect,
  reservationController.getAllReservations
);
router
  .route('/:id')
  .delete(
    authController.protect,
    reservationController.deletReservation
  )
  .patch(
    authController.protect,
    reservationController.updateReservation
  );

router.get(
  '/todays-reservation',
  authController.protect,
  reservationController.todaysReservation
);

module.exports = router;
