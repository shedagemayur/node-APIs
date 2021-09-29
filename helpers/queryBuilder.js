const queryBuilder = (tblname, key, params = {}) => {
    const table = require('../database/queries/_' + tblname + '.sql');

    let sql = table[key];

    if (params !== null) {
        Object.keys(params).forEach(key => {
            sql = sql.replace('<<' + key + '>>', params[key]);
        });
    }
    return sql;
}

module.exports = queryBuilder;