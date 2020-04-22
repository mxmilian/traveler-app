//const catchAsync = require('../errors/catchAsync');
//const Errors = require('../errors/errorsClass');

const getHome = (req, res) => {
  res.status(200).render('home', {
    title: 'Welcome page'
  });
};

const getTours = (req, res) => {
  res.status(200).render('tours', {
    title: 'Find your tour!'
  });
};

module.exports = {
  getHome,
  getTours
};
