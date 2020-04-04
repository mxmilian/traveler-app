const Errors = require('./errorsClass');

const handleCastErrorDB = error => {
  const message = `Wrong ${error.path}: ${error.value} 🦠`;
  return new Errors(message, 400);
};

const handleDuplicateErrorDB = error => {
  const message = `Name should be unique. This name is already exists in data base ${error.keyValue.name} 🦄`;
  return new Errors(message, 400);
};

const handleValidationErrorDB = error => {
  const errors = Object.values(error.errors)
    .map(el => el.message)
    .join(`. `);

  const message = `Validation errors 🙀: ${errors}`;
  return new Errors(message, 400);
};

const handleJWTError = () => {
  return new Errors('Invalid token. Please log in again!😢', 401);
};

const handleJWTExpiredError = () => {
  return new Errors('Your token is expired please log in again!🤗', 401);
};

module.exports = {
  handleCastErrorDB,
  handleDuplicateErrorDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError
};
