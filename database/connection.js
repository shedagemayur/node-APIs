const mysql = require('mysql2');
const config = require('../config');

const stablishedConnection = (mydb) => {
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER_NAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || mydb
        });
        con.connect((err) => {
            if (err) {
                reject(err);
            }
            resolve(con);
        });
    })
}
const closeDbConnection = (con) => {
    con.destroy();
}
module.exports = { stablishedConnection, closeDbConnection };