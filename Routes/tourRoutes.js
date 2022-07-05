const express = require('express');

const router = express.Router();
const tourController = require('../Controller/tourController');

router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    tourController.checkBody,
    tourController.addNewTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
