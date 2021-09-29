const resCodeList = require('../constants/errors');

exports.responseText = (type, code, params = '') => {
    return resCodeList.Messages(params)[type][code];
}