//const Tour = require('../models/tourModel');

const validateID = (req, res, next, val) => {
  res.json({
    status: 'success',
    data: null
  });
};

//Routes handlers
const getAllTours = (req, res) => {
  res.json({
    status: 'success',
    data: null
  });
};

const getTour = (req, res) => {
  res.json({
    status: 'success',
    data: null
  });
};

const createTour = (req, res) => {
  res.json({
    status: 'success',
    data: null
  });
};

const updateTour = (req, res) => {
  res.json({
    status: 'success',
    data: null
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  validateID
};
