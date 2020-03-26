const Tour = require('../models/tourModel');
const catchAsync = require('../errors/catchAsync');
const APIqueryFeatures = require('../utils/apiQueryFeatures');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

//Routes handlers
const getAllTours = catchAsync(async (req, res) => {
  //Execute query
  const { mongooseQuery } = new APIqueryFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
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
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newTour
    }
  });
});

const updateTour = catchAsync(async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour
    }
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      deletedTour
    }
  });
});

const getMonthlyPlan = catchAsync(async (req, res) => {
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
