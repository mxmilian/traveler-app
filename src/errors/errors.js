const Errors = require('./errorsClass');

const errorDev = (error, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      status: error.status,
      error: error,
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
  //FRONT END
  console.error('ERROR💥', error);
  return res.status(error.statusCode).render('error', {
    title: 'Something went completely wrong 😕',
    message: error.message
  });
};

const errorProd = (error, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
      //Programming or other unknown errors
    }
    console.error('ERROR💥', error);
    return res.status(500).json({
      status: 'error',
      message: 'I am sorry, something went wrong! ☹️'
    });
  }
  //Front end
  //Operational, trusted error
  if (error.isOperational) {
    return res.status(error.statusCode).render('error', {
      status: 'error',
      message: error.message
    });
  }
  //Programming or other unknown errors
  console.error('ERROR💥', error);
  return res.status(error.statusCode).render('error', {
    status: 'error',
    message: 'I am sorry, something went wrong! 😔'
  });
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
    errorDev(error, req, res);
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

    errorProd(prodError, req, res);
  }
};

module.exports = {
  Errors,
  errorHandler
};
