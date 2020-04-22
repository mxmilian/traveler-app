const axios = require('axios').default;
const catchAsync = require('../errors/catchAsync');
//const Errors = require('../errors/errorsClass');

const getHome = catchAsync(async (req, res, next) => {
  const query = await axios.get(`${process.env.URL}/tours/top3`);
  const tours = query.data.data.readDocs;

  res.status(200).render('home', {
    title: 'Welcome!',
    tours
  });
});

const getTours = (req, res) => {
  res.status(200).render('tours', {
    title: 'Find your tour!'
  });
};

module.exports = {
  getHome,
  getTours
};
