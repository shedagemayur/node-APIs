const UserSchema = require('../models/user.model');
const { sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const user = new UserSchema(req.body);

    UserSchema.create(user, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findAll = (req, res) => {
    UserSchema.getAll(req.query.page, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findOne = (req, res) => {
    UserSchema.findByUID(req.params.uid, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.update = (req, res) => {
    const user = new UserSchema(req.body);
    UserSchema.update(req.params.uid, user, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.delete = (req, res) => {
    UserSchema.delete(req.params.uid, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};