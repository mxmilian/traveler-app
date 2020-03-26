class Errors extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorDev = (error, res) => {
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack
  });
};

const errorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    console.error('ERROR💥', error);
    res.status(500).json({
      status: 'error',
      message: 'I am sorry, something went wrong! ☹️'
    });
  }
};

//Global error handling middleware
const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || '500';
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    errorProd(error, res);
  }
};

module.exports = {
  Errors,
  errorHandler
};
