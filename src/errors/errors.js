const notFound = (req, res, next) => {
  const error = new Error(`Not found💥 - ${req.originalUrl}`);
  error.status = 'fail';
  error.statusCode = 404;
  next(error);
};

//Global error handling middleware
const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode === 200 ? 500 : error.statusCode;
  error.status = error.status || 'error';
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
