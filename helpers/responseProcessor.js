const resCodeList = require('../constants/errors');

exports.responseText = (type, code, params = '') => {
    return resCodeList.Messages(params)[type][code];
}

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