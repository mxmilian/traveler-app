const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
//This allows us to get access to the body from request
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  console.log(`I'am really happy that you use my app!💜`);
  next();
});

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//connection router with the app via middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error
const { notFound, errorHandler } = require('./error/errors');

app.use(notFound);
app.use(errorHandler);

module.exports = app;