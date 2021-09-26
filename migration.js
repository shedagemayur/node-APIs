const migrations = require('mysql-migrations');
const createConnectionDB = require('./database/connection');

const connection = createConnectionDB();

migrations.init(connection, __dirname + '/migrations', () => {
    console.log("finished running migrations");
});