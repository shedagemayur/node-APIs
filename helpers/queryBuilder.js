const queryBuilder = (tblname, method, params = {}) => {
    const table = require('../database/queries/_' + tblname + '.sql');

    let sql = table[method];

    if (params !== null) {
        Object.keys(params).forEach(key => {
            sql = sql.replace('<<' + key + '>>', params[key]);
        });
    }
    return sql;
}

module.exports = queryBuilder;