class Errors extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

//Global error handling middleware
const errorHandler = (error, req, res, next) => {
  error.statsCode = error.statsCode || 404;
  error.status = error.status || 'error';
  res.statusCode(error.status).json({
    status: error.status,
    message: error.message,
    stack: error.stack
  });
};

module.exports = {
  Errors,
  errorHandler
};
