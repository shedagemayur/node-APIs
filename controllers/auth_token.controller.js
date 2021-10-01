const UserSchema = require('../models/user.model');
const AuthTokenSchema = require('../models/auth_token.model');
const { sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const tokenData = {
        uid: req.params.uid,
        apiKey: req.headers.apikey
    };
    const token = new AuthTokenSchema(tokenData);

    AuthTokenSchema.create(token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findAll = (req, res) => {
    AuthTokenSchema.getAll(req.params.uid, req.query.page, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findOne = (req, res) => {
    AuthTokenSchema.findByToken(req.params.uid, req.params.auth_token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.update = (req, res) => {
    const tokenData = {
        platform: req.body.platform,
        userAgent: req.body.userAgent,
        appInfo: req.body.appInfo
    };
    const token = new AuthTokenSchema(tokenData);

    AuthTokenSchema.update(req.params.uid, req.params.auth_token, token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.delete = (req, res) => {
    AuthTokenSchema.delete(req.params.uid, req.params.auth_token, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.checkUserExists = (req, res, next) => {
    UserSchema.findByUID(req.params.uid, (err, data, statusCode = 200) => {
        if (err) sendResponse(res, err, data, statusCode);
        if (data && data.hasOwnProperty('data')) next();
    }, req.query.debug);
};