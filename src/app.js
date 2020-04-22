const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const { limitReq } = require('./middlewares/appProtect');

const app = express();

//Set the server-side rendering engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// Set security headers
app.use(helmet());

// Set limit req
app.use('/api', limitReq);

// Read max 10kb data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(morgan('dev'));

// Data sanitization NoSql query injection
app.use(mongoSanitize());

// Data sanitization xss
app.use(xss());

// Query sanitization from pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price',
      'maxGroup'
    ]
  })
);

app.use((req, res, next) => {
  console.clear();
  console.log(`I'am really happy that you use my app!💜`);
  next();
});

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouts');

//connection router with the app via middleware
//VIEWS ROUTES
app.get('/', (req, res) => {
  res.status(200).render('home', {
    title: 'Welcome page'
  });
});

app.get('/tours', (req, res) => {
  res.status(200).render('tours', {
    title: 'Find your tour!'
  });
});

//API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Error
const { errorHandler } = require('./errors/errors');
const Errors = require('./errors/errorsClass');

app.use((req, res, next) =>
  next(new Errors(`Not found💥 - ${req.originalUrl}`, 404))
);
app.use(errorHandler);

module.exports = app;
