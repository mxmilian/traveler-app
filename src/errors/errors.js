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
  error.statusCode = error.statusCode || '500';
  error.status = error.status || 'error';
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    status: error.status,
    message: error.message,
    stack: error.stack
  });
};

module.exports = {
  Errors,
  errorHandler
};
