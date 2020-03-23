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
    //Prepare query
    const extendedQuery = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete extendedQuery[el]);

    const stringifyQuery = JSON.stringify(extendedQuery).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    //Filter query e.g. ?price[gt]=100
    const query = Tour.find(JSON.parse(stringifyQuery));

    //Sort query e.q. ?sort=price
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      //Default sorted by createdAt
      query.sort('createdAt');
    }

    //Selected fields are displayed ?fields=name,price
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      //Default fields are displayed
      query.select('name price difficulty duration summary');
    }

    //Pagination ?page=1&?limit=5
    // default ?page=1%limit=10
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * 10;
    query.skip(skip);
    query.limit(limit);

    if (req.query.page) {
      const numberOfElements = await Tour.countDocuments();
      if (numberOfElements <= skip) {
        throw new Error('This page does not exist');
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
