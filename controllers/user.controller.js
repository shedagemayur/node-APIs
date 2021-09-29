const User = require('../models/user.model');
const { getErrorMessage } = require('../helpers/errorMessage');

exports.create = (req, res) => {
    const user = new User(req.body);

    User.create(user, (err, data, statusCode = 200) => {
        if (err) {
            res.status(statusCode).send(err);
        } else {
            res.status(statusCode).send(data);
        }
    });
};

exports.findAll = (req, res) => {
    User.getAll(req.query.page, (err, data, statusCode = 200) => {
        if (err) {
            res.status(statusCode).send(err);
        } else {
            res.status(statusCode).send(data);
        }
    });
};

exports.findOne = (req, res) => {
    User.findByUID(req.params.uid, (err, data, statusCode = 200) => {
        if (err) {
            res.status(statusCode).send(err);
        } else {
            res.status(statusCode).json(data);
        }
    });
};

exports.update = (req, res) => {
    const user = new User(req.body);
    User.update(req.params.uid, user, (err, data, statusCode = 200) => {
        if (err) {
            res.status(statusCode).send(err);
        } else {
            res.status(statusCode).json(data);
        }
    });
};

exports.delete = (req, res) => {
    User.delete(req.params.uid, (err, data, statusCode = 200) => {
        if (err) {
            res.status(statusCode).send(err);
        } else {
            res.status(statusCode).json(data);
        }
    });
};