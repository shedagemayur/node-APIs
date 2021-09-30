const User = require('../models/user.model');
const AuthToken = require('../models/auth_token.model');
const { sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const token = new AuthToken(req.body);

    AuthToken.create(token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.findAll = (req, res) => {
    AuthToken.getAll(req.query.page, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.findOne = (req, res) => {
    AuthToken.findByToken(req.params.auth_token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.update = (req, res) => {
    const token = new AuthToken(req.body);
    AuthToken.update(req.params.auth_token, token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.delete = (req, res) => {
    AuthToken.delete(req.params.auth_token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    });
};

exports.checkUserExists = (req, res, next) => {
    User.findByUID(req.params.uid, (err, data, statusCode = 200) => {
        if (err) sendResponse(res, err, data, statusCode);
        if (data && data.length) next();
    });
};