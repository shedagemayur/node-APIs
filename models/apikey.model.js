const crypto = require('crypto');
const queryBuilder = require('../helpers/queryBuilder');
const { responseText, removeEmptyValues } = require('../helpers/responseProcessor');

function APIKeySchema(apikey) {
    this.name = apikey.name;
    this.scope = apikey.scope;
    this.apiKey = apikey.apiKey;
    this.createdBy = apikey.createdBy;
    this.createdAt = apikey.createdAt;
    this.updatedAt = apikey.updatedAt;
    this.deletedAt = apikey.deletedAt;
}

APIKeySchema.select = (custom = []) => {
    if (custom.length) return custom;
    return ['apiKey', 'name', 'scope', 'createdAt'];
}

APIKeySchema.create = async (newAPIKey, callback, debug) => {
    const keyToCreate = removeEmptyValues(newAPIKey);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('apikeys', 'CREATE', {});

    keyToCreate.apiKey = crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
    keyToCreate.createdAt = keyToCreate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['apikeys', keyToCreate]);

        if (result['affectedRows']) {
            const getKey = queryBuilder('apikeys', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getKey, [APIKeySchema.select(), 'apikeys', keyToCreate.apiKey]);

            callback(null, { data: removeEmptyValues(rows[0]) }, 201);
        } else {
            callback(responseText({
                type: 'error',
                key: 'API_KEY',
                code: 'ER_CREATING_API_KEY'
            }), null, 500);
        }
    } catch (e) {
        callback(responseText({
            type: 'error',
            key: 'GLOBALS',
            code: 'SERVER_ERROR',
            trace: e
        }, debug), null, 500);
    }
    finally {
        connection.release();
    }
};

APIKeySchema.getAll = async (req, callback, debug) => {
    const perPage = 10;
    const page = req.query.page == null ? 1 : req.query.page;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'LIST_CUSTOM', {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, [APIKeySchema.select(), 'apikeys']);
        if (rows.length == 0) return callback(null, { data: rows });

        let filterRows = [];
        rows.forEach(row => {
            filterRows.push(removeEmptyValues(row));
        });
        callback(null, { data: filterRows });
    } catch (e) {
        callback(responseText({
            type: 'error',
            key: 'GLOBALS',
            code: 'SERVER_ERROR',
            trace: e
        }, debug), null, 500);
    }
    finally {
        connection.release();
    }
};

APIKeySchema.findByKey = async (apikey, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'FIND_CUSTOM', {});

    try {
        const [rows] = await connection.query(sql, [APIKeySchema.select(), 'apikeys', apikey]);
        if (rows.length) {
            return callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'API_KEY',
                input: apikey,
                code: 'ER_API_KEY_NOT_FOUND',
            }), null, 404);
        }
    } catch (e) {
        callback(responseText({
            type: 'error',
            key: 'GLOBALS',
            code: 'SERVER_ERROR',
            trace: e
        }, debug), null, 500);
    }
    finally {
        connection.release();
    }
};

APIKeySchema.update = async (apikey, newAPIKey, callback, debug) => {
    const keyToCreate = removeEmptyValues(newAPIKey);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('apikeys', 'UPDATE', {});

    keyToCreate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['apikeys', keyToCreate, apikey]);

        if (result['affectedRows']) {
            const getKey = queryBuilder('apikeys', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getKey, [APIKeySchema.select(), 'apikeys', apikey]);
            callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'API_KEY',
                input: apikey,
                code: 'ER_API_KEY_NOT_FOUND',
            }), null, 404);
        }
    } catch (e) {
        callback(responseText({
            type: 'error',
            key: 'GLOBALS',
            code: 'SERVER_ERROR',
            trace: e
        }, debug), null, 500);
    }
    finally {
        connection.release();
    }
};

APIKeySchema.delete = async (apikey, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('apikeys', 'DELETE', {});

    try {
        const [result] = await connection.query(sql, ['apikeys', apikey]);

        if (result['affectedRows']) {
            callback(null, responseText({
                type: 'success',
                key: 'API_KEY',
                input: apikey,
                code: 'MSG_API_KEY_DELETED'
            }));
        } else {
            callback(responseText({
                type: 'error',
                key: 'API_KEY',
                input: apikey,
                code: 'ER_API_KEY_NOT_FOUND',
            }), null, 404);
        }
    } catch (e) {
        callback(responseText({
            type: 'error',
            key: 'GLOBALS',
            code: 'SERVER_ERROR',
            trace: e
        }, debug), null, 500);
    }
    finally {
        connection.release();
    }
};

module.exports = APIKeySchema;