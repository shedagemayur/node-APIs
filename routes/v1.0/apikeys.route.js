const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../middlewares/request.validate');
const apikeys = require('../../controllers/apikey.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', apikeys.findAll);
    router.post('/',
        [
            body('name').not().isEmpty(),
            body('scope').not().isEmpty()
        ],
        validator.showError,
        apikeys.create
    );

    router
        .route('/:apiKey')
        .get(apikeys.findOne)
        .put(
            [
                body('name').optional().not().isEmpty(),
                body('scope').optional().not().isEmpty()
            ],
            validator.showError,
            apikeys.update
        )
        .delete(apikeys.delete);

    app.use('/v1.0/apikeys',
        header('apiKey').not().isEmpty(),
        validator.showError,
        apikeys.validate,
        router
    );
}