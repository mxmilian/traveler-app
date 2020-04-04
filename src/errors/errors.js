const Errors = require('./errorsClass');

const errorDev = (error, res) => {
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    error: error,
    name: error.name,
    message: error.message,
    stack: error.stack
  });
};

const errorProd = (error, res) => {
  //Operational, trusted error
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
    //Programming or other unknown errors
  } else {
    console.error('ERROR💥', error);
    res.status(500).json({
      status: 'error',
      message: 'I am sorry, something went wrong! ☹️'
    });
  }
};

const {
  handleCastErrorDB,
  handleDuplicateErrorDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError
} = require('./prodErros');

//Global error handling middleware
const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || '500';
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let prodError = { ...error };

    //Invalid path
    if (prodError.name === 'CastError') {
      prodError = handleCastErrorDB(error);
    }
    //Double unique value
    if (error.code === 11000) {
      prodError = handleDuplicateErrorDB(error);
    }

    //Validation
    if (error.name === 'ValidationError') {
      prodError = handleValidationErrorDB(error);
    }

    //JWT error
    if (error.name === 'JsonWebTokenError') {
      prodError = handleJWTError(error);
    }

    //JWT expired
    if (error.name === 'TokenExpiredError') {
      prodError = handleJWTExpiredError(error);
    }
    errorProd(prodError, res);
  }
};

module.exports = {
  Errors,
  errorHandler
};
