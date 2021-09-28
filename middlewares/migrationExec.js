const { exec } = require("child_process");
const { getErrorMessage } = require('../helpers/errorMessage');
const Redis = require('redis');

exports.execute = async (req, res, next) => {
    const dbName = req.headers.app_id;
    const redisClient = Redis.createClient();

    redisClient.on('error', (error) => {
        if (error) {
            res.status(500).send({
                error: 'ECONNREFUSED',
                message: 'Unable to connect to caching server.'
            });
        }
    }).on('connect', async () => {
        redisClient.hget('migrations', dbName, async (error, data) => {
            if (data != null) { next(); return; };
            try {
                await connection.query('CREATE TABLE IF NOT EXISTS `mysql_migrations_347ertt3e` (`timestamp` varchar(254) NOT NULL UNIQUE)');

                exec("node migration.js up " + dbName, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);

                    redisClient.hset('migrations', dbName, 1);
                    next();
                });
            } catch (e) {
                console.log(e);
                res.status(500).send({
                    error: 'SERVER_ERROR',
                    message: getErrorMessage('USERS', 'SERVER_ERROR')
                });
            }
            finally {
                connection.release();
            }
        });
    });
}