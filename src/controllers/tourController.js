const Tour = require('../models/tourModel');

// const validateID = (req, res, next, val) => {
//   console.log(req.params);
//   res.json({
//     status: 'fail',
//     data: null
//   });
// };

//Routes handlers
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
  deleteTour
  //validateID
};
