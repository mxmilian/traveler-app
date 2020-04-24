const express = require('express');

const router = express.Router();

const { getHome, getTours, getTour } = require('../controllers/viewController');

router.get('/', getHome);
router.get('/tours', getTours);
router.get('/tours/:slug', getTour);

module.exports = router;
