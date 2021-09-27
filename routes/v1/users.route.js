const userController = require('../../controllers/users.controller');
const express = require('express');
const router = express.Router();

module.exports = (app) => {
    router.get('/', userController.listUsers);
    router.post('/', userController.createUser);

    router
        .route('/:uid')
        .get(userController.getUser)
        .put(userController.updateUser)
        .delete(userController.deleteUser);

    app.use('/v1/users', router);
}