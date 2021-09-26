const userController = require('../../controllers/users.controller');
const express = require('express');
const router = express.Router();

module.exports = (app) => {
    router.get('/', userController.getAllUsers);

    app.use('/v1/users', router);
}