const crypto = require('crypto');
const queryBuilder = require('../helpers/queryBuilder');
const { responseText } = require('../helpers/responseProcessor');

function APIKey(apikey) {
    this.name = apikey.name;
    this.scope = apikey.scope;
    this.apiKey = apikey.apiKey;
    this.createdBy = apikey.createdBy;
    this.createdAt = apikey.createdAt;
    this.updatedAt = apikey.updatedAt;
    this.deletedAt = apikey.deletedAt;
}

APIKey.create = async (newAPIKey, callback) => {
    Object.keys(newAPIKey).forEach((key) => newAPIKey[key] === undefined && delete newAPIKey[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('apikeys', 'CREATE', {});

    newAPIKey.apiKey = crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
    newAPIKey.createdAt = newAPIKey.updatedAt = Math.floor(+new Date() / 1000);

    try {
        await connection.query(sql, ['apikeys', newAPIKey]);
        callback(null, { ...newAPIKey }, 201);
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            details: responseText('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

APIKey.getAll = async (pageNo, callback) => {
    const perPage = 10;
    const page = pageNo == null ? 1 : pageNo;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'LIST', {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['apikeys']);
        callback(null, rows);
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            details: responseText('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

APIKey.findByKey = async (apikey, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'FIND', {});

    try {
        const [rows] = await connection.query(sql, ['apikeys', apikey]);
        if (rows.length) return callback(null, rows);

        callback(null, rows, 404);
    } catch (e) {
        console.log(e);
        callback({
            error: 'SERVER_ERROR',
            details: responseText('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

APIKey.update = async (apikey, newAPIKey, callback) => {
    Object.keys(newAPIKey).forEach((key) => newAPIKey[key] === undefined && delete newAPIKey[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('apikeys', 'UPDATE', {});

    newAPIKey.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['apikeys', newAPIKey, apikey]);

        if (result['affectedRows']) {
            const getToken = queryBuilder('apikeys', 'FIND', {});
            const [rows] = await connection.query(getToken, ['apikeys', apikey]);
            callback(null, rows);
        } else {
            callback({
                error: 'ER_API_KEY_NOT_FOUND',
                details: responseText('API_KEY', 'ER_API_KEY_NOT_FOUND', apikey)
            }, null, 404);
        }
    } catch (e) {
        console.log(e);
        callback({
            error: 'SERVER_ERROR',
            details: responseText('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

APIKey.delete = async (apikey, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'DELETE', {});

    try {
        const [result] = await connection.query(sql, ['apikeys', apikey]);

        if (result['affectedRows']) {
            callback(null, {
                success: true,
                details: responseText('API_KEY', 'MSG_API_KEY_DELETED', apikey)
            });
        } else {
            callback({
                error: 'ER_API_KEY_NOT_FOUND',
                details: responseText('API_KEY', 'ER_API_KEY_NOT_FOUND', apikey)
            }, null, 404);
        }
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            details: responseText('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

module.exports = APIKey;