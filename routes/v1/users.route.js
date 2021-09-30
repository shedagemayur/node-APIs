const express = require('express');
const validator = require('../../middlewares/request.validate');
const { param, body, header } = require('express-validator');
const users = require('../../controllers/user.controller');
const authTokens = require('../../controllers/auth_token.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', users.findAll);
    router.post('/',
        [
            body('uid').not().isEmpty(),
            body('name').not().isEmpty()
        ],
        validator.showError,
        users.create
    );

    router
        .route('/:uid')
        .get(users.findOne)
        .put(
            body('name').optional().not().isEmpty(),
            validator.showError,
            users.update
        )
        .delete(users.delete);

    router
        .route('/:uid/auth_tokens')
        .get(authTokens.checkUserExists, authTokens.findAll)
        .post(
            authTokens.checkUserExists,
            [
                param('uid').not().isEmpty(),
                header('apiKey').not().isEmpty()
            ],
            validator.showError,
            authTokens.create
        )

    router
        .route('/:uid/auth_tokens/:auth_token')
        .get(authTokens.checkUserExists, authTokens.findOne)
        .put(
            authTokens.checkUserExists,
            [
                param('uid').not().isEmpty(),
                header('apiKey').not().isEmpty()
            ],
            validator.showError,
            authTokens.update
        )
        .delete(authTokens.checkUserExists, authTokens.delete)

    app.use('/v1/users', router);
}