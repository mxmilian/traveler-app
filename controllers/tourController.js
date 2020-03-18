const fs = require('fs');

//convert json to object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const validateID = (req, res, next, val) => {
  console.log(
    `I'am working middleware 👩‍💻 with id ${val} and tours param ${tours.length}`
  );
  // eslint-disable-next-line radix
  if (parseInt(val) >= tours.length) {
    return res.status(404).json({ status: 'Failed', message: 'Invalid ID' });
  }
  next();
};

//Routes handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  // eslint-disable-next-line radix
  const tour = tours.find(element => element.id === parseInt(req.params.id));
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newID, ...req.body };
  tours.push(newTour);
  //Write file. JSON.stringify object -> to json
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) console.log(err.message);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '!Updated tour here!'
    }
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
