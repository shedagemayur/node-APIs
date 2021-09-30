const { validationResult } = require('express-validator');

exports.showError = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'ER_BAD_REQUEST',
            details: errors.mapped()
        });
    }
    next();
};