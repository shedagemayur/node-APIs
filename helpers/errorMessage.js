const errorList = require('../constants/errors');

exports.getErrorMessage = (type, code, params = '') => {
    return errorList.Messages(params)[type][code];
}