const rateLimit = require('express-rate-limit');

const limitReq = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Woah, woah, slow down man!🙅'
});

module.exports = {
  limitReq
};
