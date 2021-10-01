const { exec } = require("child_process");
const { responseText } = require('../helpers/responseProcessor');
const Redis = require('redis');

exports.execute = async (req, res, next) => {
    const dbName = req.headers.app_id;
    const redisClient = Redis.createClient();

    redisClient.on('error', (error) => {
        if (error) {
            res.status(500).json(responseText({
                type: 'error',
                key: 'APP',
                code: 'ER_ECONNREFUSED',
                trace: error
            }, req.query.debug));
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
                res.status(500).json(responseText({
                    type: 'error',
                    key: 'GLOBALS',
                    code: 'SERVER_ERROR',
                    trace: e
                }, req.query.debug));
            }
            finally {
                connection.release();
            }
        });
    });
}