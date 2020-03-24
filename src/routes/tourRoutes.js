const express = require('express');

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats
} = require('../controllers/tourController');

//one router for each of the resource
const router = express.Router();

//Mounting a new router on route
router.route('/top5').get(aliasTopTours, getAllTours);

router.route('/stats').get(getTourStats)

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
