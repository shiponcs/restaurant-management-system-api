const express = require('express');

const router = express.Router();
const tourController = require('../Controller/tourController');

router
  .route('/monthly-plan/:year')
  .get(tourController.monthlyPlan);
router
  .route('/top-5-cheap-tour')
  .get(
    tourController.aliasCheapTour,
    tourController.getAllTours
  );
router
  .route('/tour-stats')
  .get(tourController.tourStatistics);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
