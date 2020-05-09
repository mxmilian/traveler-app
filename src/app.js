const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
//const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const { limitReq } = require('./middlewares/appProtect');

const app = express();

//app.use(cors());

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
app.use(cookieParser());

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
  console.log(req.cookies);
  next();
});

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

//connection router with the app via middleware
//VIEWS ROUTES
app.use('/', viewRouter);

//API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

//Error
const { errorHandler } = require('./errors/errors');
const Errors = require('./errors/errorsClass');

app.use((req, res, next) =>
  next(new Errors(`Not found💥 - ${req.originalUrl}`, 404))
);
app.use(errorHandler);

module.exports = app;
