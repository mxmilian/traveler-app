const Tour = require('../models/tourModel');
const APIqueryFeatures = require('../utils/apiQueryFeatures');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');

const { createOne, updateOne, deleteOne } = require('./crudFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

//Routes handlers
const getAllTours = catchAsync(async (req, res, next) => {
  //Execute query
  const { mongooseQuery } = new APIqueryFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const tours = await mongooseQuery;

  //Respond
  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
    .populate({
      path: 'guides',
      select: '-__v -passwordChangedAt'
    })
    .populate('reviews');
  if (!tour) {
    return next(new Errors(`Not found💥 - ${req.originalUrl}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
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
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getMonthlyPlan
};
