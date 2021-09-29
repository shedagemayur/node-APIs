const User = require('../models/user.model');
const { sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const user = new User(req.body);

    User.create(user, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.findAll = (req, res) => {
    User.getAll(req.query.page, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.findOne = (req, res) => {
    User.findByUID(req.params.uid, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.update = (req, res) => {
    const user = new User(req.body);
    User.update(req.params.uid, user, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.delete = (req, res) => {
    User.delete(req.params.uid, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};