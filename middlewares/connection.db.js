const mysql = require('mysql2');
const { responseText } = require('../helpers/responseProcessor');

exports.openConnection = async (req, res, next) => {
    const ON_DEMAND_DB = req.headers['app_id'];

    connectionPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: ON_DEMAND_DB,
        connectionLimit: process.env.CONNECTION_LIMIT,
        waitForConnections: true,
        queueLimit: 0
    }).promise();

    try {
        connection = await connectionPool.getConnection();
        console.log('connected as id ' + connection.threadId);
        connection.release();
        next();
    } catch (e) {
        res.status(404).json(responseText({
            type: 'error',
            key: 'APP',
            code: 'ER_APP_NOT_FOUND',
            input: ON_DEMAND_DB,
            trace: e
        }, req.query.debug));
    }
};