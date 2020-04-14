const Tour = require('../models/tourModel');
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
  getMonthlyPlan
};
