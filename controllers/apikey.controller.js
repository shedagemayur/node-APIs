const APIKeySchema = require('../models/apikey.model');
const { responseText, sendResponse } = require('../helpers/responseProcessor');

exports.create = (req, res) => {
    const apikey = new APIKeySchema(req.body);

    APIKeySchema.create(apikey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findAll = (req, res) => {
    APIKeySchema.getAll(req, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.findOne = (req, res) => {
    APIKeySchema.findByKey(req.params.apiKey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.update = (req, res) => {
    const apikey = new APIKeySchema(req.body);
    APIKeySchema.update(req.params.apiKey, apikey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.delete = (req, res) => {
    APIKeySchema.delete(req.params.apiKey, (err, data, statusCode = 200) => {
        sendResponse(res, err, data, statusCode);
    }, req.query.debug);
};

exports.validate = (req, res, next) => {
    APIKeySchema.findByKey(req.headers.apikey, (err, data, statusCode = 200) => {
        if (err) sendResponse(res, err, data, statusCode);
        if (data && data.hasOwnProperty('data')) {
            data = data['data'];
            if (data.hasOwnProperty('scope') && data['scope'] === 'fullAccess') {
                next();
            } else {
                sendResponse(res, responseText({
                    type: 'error',
                    key: 'API_KEY',
                    input: req.headers.apikey,
                    code: 'ER_AUTH_NO_ACCESS',
                }), null, 403);
            }
        }
    }, req.query.debug);
};