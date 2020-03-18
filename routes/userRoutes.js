const express = require('express');
const { getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser } = require('../controllers/userController');
//one router for each of the resource
const router = express.Router();
//Mounting a new router on route
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;