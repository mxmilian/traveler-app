const { Errors } = require('./errors');

module.exports = fn => {
  return (req, res, next) => {
    //fn(req, res, next).catch(err => next(err));
    fn(req, res, next).catch(err => next(new Errors(err.message, 404)));
  };
};
