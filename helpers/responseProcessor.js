const resCodeList = require('../constants/errors');

exports.responseText = (params = {}, debug = false) => {
    let response = {};

    switch (params['type']) {
        case 'error':
            response = {
                error: {
                    code: params['code'],
                    message: resCodeList.Messages(params['input'])[params['key']][params['code']]
                }
            }
            break;

        case 'success':
            response = {
                data: {
                    success: true,
                    message: resCodeList.Messages(params['input'])[params['key']][params['code']]
                }
            }
            break;

        default:
            break;
    }
    if (debug) response[params['type']]['trace'] = params['trace'];

    return response;
};

exports.sendResponse = (...params) => {
    [res, err, data, statusCode] = params;

    if (err) {
        res.status(statusCode).send(err);
    } else {
        res.status(statusCode).send(data);
    }
};

exports.removeEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};