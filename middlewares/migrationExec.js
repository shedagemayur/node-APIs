const { exec } = require("child_process");
const { getErrorMessage } = require('../helpers/errorMessage');
const Redis = require('redis');

const redisClient = Redis.createClient();

exports.execute = async (req, res, next) => {
    const dbName = req.headers.app_id;
    await getRedisCache('migrations', dbName, async () => {
        const connection = await connectionPool.getConnection();

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
    }, next);
}

// need to handled redis connection failure
// if redis failed to connect then call cb function to continue with mysql

const getRedisCache = (key, value, cb, next) => {
    return new Promise((resolve, reject) => {
        redisClient.hget(key, value, async (error, data) => {
            if (data != null) {
                next();
                resolve(data);
            } else {
                cb();
            }
        });
    });
}