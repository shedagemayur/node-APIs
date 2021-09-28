const mysql = require('mysql2');
const migrations = require('mysql-migrations');
const dotenv = require('dotenv');

dotenv.config();

const checkCommand = process.argv.slice(2);

if (checkCommand.length && checkCommand[0] == 'up') {
    const getDBName = process.argv.slice(3);
    const dbName = getDBName[0];

    process.argv.pop();

    const connection = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: '',
        database: dbName
    });

    migrations.init(connection, __dirname + '/migrations', () => {
        console.log("finished running migrations");
    });
} else if (checkCommand.length && checkCommand[0] == 'add') {

    const connection = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: '',
        database: 'atomchat' // add local database to create migration files in /migration dir
    });

    migrations.init(connection, __dirname + '/migrations', () => {
        console.log("finished running migrations");
    });
}