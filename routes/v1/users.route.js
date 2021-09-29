const express = require('express');
const { check, validationResult } = require('express-validator');
const users = require('../../controllers/user.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', users.findAll);
    router.post('/',
        [
            check('uid').not().isEmpty(),
            check('name').not().isEmpty()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'ER_BAD_REQUEST',
                    message: errors.mapped()
                });
            }
            next();
        }, users.create);

    router
        .route('/:uid')
        .get(users.findOne)
        .put(
            check('name').optional().not().isEmpty(),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: 'ER_BAD_REQUEST',
                        message: errors.mapped()
                    });
                }
                next();
            }, users.update)
        .delete(users.delete);

    app.use('/v1/users', router);
}