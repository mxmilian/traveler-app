const express = require('express');

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  validateID
} = require('../controllers/tourController');

//one router for each of the resource
const router = express.Router();

router.param('id', validateID);

//Mounting a new router on route
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
