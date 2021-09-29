const express = require('express');
const { param, body, header, validationResult } = require('express-validator');
const users = require('../../controllers/user.controller');
const auth_tokens = require('../../controllers/auth_token.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', users.findAll);
    router.post('/',
        [
            body('uid').not().isEmpty(),
            body('name').not().isEmpty()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'ER_BAD_REQUEST',
                    details: errors.mapped()
                });
            }
            next();
        }, users.create);

    router
        .route('/:uid')
        .get(users.findOne)
        .put(
            body('name').optional().not().isEmpty(),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: 'ER_BAD_REQUEST',
                        details: errors.mapped()
                    });
                }
                next();
            }, users.update)
        .delete(users.delete);

    router
        .route('/:uid/auth_tokens')
        .get(auth_tokens.checkUserExists, auth_tokens.findAll)
        .post(auth_tokens.checkUserExists,
            [
                param('uid').not().isEmpty(),
                header('apiKey').not().isEmpty()
            ],
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: 'ER_BAD_REQUEST',
                        details: errors.mapped()
                    });
                }
                next();
            }, auth_tokens.create)

    router
        .route('/:uid/auth_tokens/:auth_token')
        .get(auth_tokens.checkUserExists, auth_tokens.findOne)
        .put(auth_tokens.checkUserExists,
            [
                param('uid').not().isEmpty(),
                header('apiKey').not().isEmpty()
            ],
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: 'ER_BAD_REQUEST',
                        details: errors.mapped()
                    });
                }
                next();
            }, auth_tokens.update)
        .delete(auth_tokens.checkUserExists, auth_tokens.delete)

    app.use('/v1/users', router);
}