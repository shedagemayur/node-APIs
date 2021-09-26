const users = require('../database/queries/_users.sql');

const queryBuilder = (key, params = {}) => {
    let sql = users[key];

    if (params !== null) {
        Object.keys(params).forEach(key => {
            sql = sql.replace('<<' + key + '>>', params[key]);
        });
    }
    return sql;
}

module.exports = queryBuilder;