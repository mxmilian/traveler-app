const axios = require('axios').default;
const catchAsync = require('../errors/catchAsync');
const Tour = require('../models/tourModel');
//const Errors = require('../errors/errorsClass');

const getHome = catchAsync(async (req, res, next) => {
  const query = await axios.get(`${process.env.URL}/tours/top3`);
  const tours = query.data.data.readDocs;

  res.status(200).render('home', {
    title: 'Welcome!',
    tours
  });
});

const getTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('tours', {
    title: 'Find your tour!',
    tours
  });
});

const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  res.status(200).render('tour', {
    title: tour.name,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    tour
  });
});

const getLogin = (req, res) => {
  res.status(200).render('login');
};

module.exports = {
  getHome,
  getTours,
  getTour,
  getLogin
};
