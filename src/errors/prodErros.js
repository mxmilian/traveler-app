const Errors = require('./errorsClass');

const handleCastErrorDB = error => {
  console.log(typeof Errors);
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

module.exports = {
  handleCastErrorDB,
  handleDuplicateErrorDB,
  handleValidationErrorDB
};
