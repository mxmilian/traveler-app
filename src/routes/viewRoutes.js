const express = require('express');

const router = express.Router();

const { getHome, getTours } = require('../controllers/viewController');

router.get('/', getHome);
router.get('/tours', getTours);

module.exports = router;
