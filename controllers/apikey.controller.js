const APIKey = require('../models/apikey.model');
const { sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const apikey = new APIKey(req.body);

    APIKey.create(apikey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findAll = (req, res) => {
    APIKey.getAll(req, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findOne = (req, res) => {
    APIKey.findByKey(req.params.apiKey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.update = (req, res) => {
    const apikey = new APIKey(req.body);
    APIKey.update(req.params.apiKey, apikey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.delete = (req, res) => {
    APIKey.delete(req.params.apiKey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};