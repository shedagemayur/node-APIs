const express = require('express');
const validator = require('../../middlewares/request.validate');
const { param, body, header } = require('express-validator');
const users = require('../../controllers/user.controller');
const apikeys = require('../../controllers/apikey.controller');
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
        .get(authTokens.findAll)
        .post(authTokens.create)

    router
        .route('/:uid/auth_tokens/:auth_token')
        .get(authTokens.findOne)
        .put(authTokens.update)
        .delete(authTokens.delete)

    router.param('uid', authTokens.checkUserExists);

    app.use('/v1.0/users',
        header('apiKey').not().isEmpty(),
        validator.showError,
        apikeys.validate,
        router
    );
}