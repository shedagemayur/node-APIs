const ERROR = require('../constants/errors');

exports.getErrorMessage = (type, code, params = '') => {
    return ERROR.MESSAGES(params)[type][code];
}