const express = require('express');

const {
  readAllTours,
  readTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getMonthlyPlan,
  getToursWithin
} = require('../controllers/tourController');

const { protectRoute, restrictRoute } = require('../middlewares/authProtect');

//one router for each of the resource
const router = express.Router();

//Mounting a new router on route
router.route('/top5').get(aliasTopTours, readAllTours);
router
  .route('/monthlyPlan/:year')
  .get(
    protectRoute,
    restrictRoute('guide', 'moderator', 'admin'),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/')
  .get(readAllTours)
  .post(protectRoute, restrictRoute('admin', 'moderator'), createTour);

router
  .route('/:id')
  .get(readTour)
  .patch(protectRoute, restrictRoute('admin', 'moderator'), updateTour)
  .delete(protectRoute, restrictRoute('admin', 'moderator'), deleteTour);

//Nested routers (review)
const reviewRouter = require('./reviewRouts');
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
