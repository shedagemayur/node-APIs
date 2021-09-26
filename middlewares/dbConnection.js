const mysql = require('mysql2');
const config = require('../config');

exports.createConnection = async (req, res, next) => {

    connectionPool = mysql.createPool({
        host: config.DATABASE.host,
        user: config.DATABASE.user,
        password: '',
        database: req.headers.app_id,
        waitForConnections: true,
        connectionLimit: 25,
        queueLimit: 0
    }).promise();

    try {
        connection = await connectionPool.getConnection();
        console.log('connected as id ' + connection.threadId);
        connection.release();
        next();
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: 'NOT_FOUND', errorMessage: 'Invalid APP_ID' });
    }
};