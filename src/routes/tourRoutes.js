const express = require('express');

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getMonthlyPlan
} = require('../controllers/tourController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

//one router for each of the resource
const router = express.Router();

//Mounting a new router on route
router.route('/top5').get(aliasTopTours, getAllTours);
router.route('/monthlyPlan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(protectRoute, getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, restrictRoute('admin', 'moderator'), deleteTour);

//Nested routers (review)
const reviewRouter = require('./reviewRouts');
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
