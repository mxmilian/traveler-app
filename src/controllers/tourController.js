const Tour = require('../models/tourModel');

// const validateID = (req, res, next, val) => {
//   console.log(req.params);
//   res.json({
//     status: 'fail',
//     data: null
//   });
//

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

//Routes handlers
const getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //Build query
    //1A) Prepare query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => {
      delete queryObj[el];
    });

    //1B)Filtering
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    const query = Tour.find(JSON.parse(queryStr));

    //2) Sorting by
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('createdAt');
    }

    //3) Limitings fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    //4) Pagination
    // eslint-disable-next-line radix
    const page = parseInt(req.query.page) || 1;
    // eslint-disable-next-line radix
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (numberOfTours <= skip) {
        throw new Error('This page does not exist!');
      }
    }
    //Execute query
    const tours = await query;

    //Respond
    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });
  } catch (e) {
    res.status(400);
    res.json({
      status: 'fail',
      message: e.message
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (e) {
    res.status(400);
    res.json({
      status: 'fail',
      message: e.message
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTour
      }
    });
  } catch (e) {
    res.status(400);
    res.json({
      status: 'fail',
      message: e.message
    });
  }
};

const updateTour = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e.message
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        deletedTour
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e.message
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours
  //validateID
};
