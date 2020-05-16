const axios = require('axios').default;
const catchAsync = require('../errors/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const Errors = require('../errors/errorsClass');

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

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new Errors('I did not found anything 🙈', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    tour
  });
});

const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('tours', {
    title: 'My awesome tours!',
    tours
  });
});

const activationAccount = (req, res) => {
  res.status(200).render('activation', {
    title: 'Activation account!'
  });
};

const getLogin = (req, res) => {
  res.status(200).render('login');
};

const getRegister = (req, res) => {
  res.status(200).render('register');
};

const getMe = (req, res) => {
  res.status(200).render('account');
};

module.exports = {
  getHome,
  getTours,
  getTour,
  getLogin,
  getRegister,
  getMe,
  getMyTours,
  activationAccount
};
