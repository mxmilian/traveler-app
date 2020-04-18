const Tour = require('../models/tourModel');
const Errors = require('../errors/errorsClass');
const catchAsync = require('../errors/catchAsync');

const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne
} = require('./crudFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

//Routes handlers
const getToursWithin = catchAsync(async (req, res, next) => {
  //router.route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithing);
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3063.2 : distance / 6378.1;

  if (!lat || !lng)
    next(new Errors('Not founded latitude or longitude! 🙅‍', 400));

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  //router.route('/distances/:latlng/unit/:unit').get(getDistances)
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.0006213712 : 0.001;

  if (!lat || !lng)
    next(new Errors('Not founded latitude or longitude! 🙅‍', 400));

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances
    }
  });
});

const readAllTours = readAll(Tour);
const readTour = readOne(Tour, {
  path: 'reviews'
});
const createTour = createOne(Tour);
const updateTour = updateOne(Tour);
const deleteTour = deleteOne(Tour);

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        countTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $sort: { countTours: -1 }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      monthlyPlan
    }
  });
});

module.exports = {
  readAllTours,
  readTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getMonthlyPlan,
  getToursWithin,
  getDistances
};
