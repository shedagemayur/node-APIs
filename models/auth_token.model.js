const crypto = require('crypto');
const queryBuilder = require('../helpers/queryBuilder');
const { responseText, removeEmptyValues } = require('../helpers/responseProcessor');

function AuthTokenSchema(user) {
    this.authToken = user.authToken;
    this.uid = user.uid;
    this.deviceId = user.deviceId;
    this.apiKey = user.apiKey;
    this.platform = user.platform;
    this.userAgent = user.userAgent;
    this.appInfo = user.appInfo;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
}

AuthTokenSchema.select = (custom = []) => {
    if (custom.length) return custom;
    return ['uid', 'authToken', 'platform', 'userAgent', 'appInfo', 'createdAt'];
}

AuthTokenSchema.create = async (newAuthToken, callback, debug) => {
    const tokenToCreate = removeEmptyValues(newAuthToken);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('auth_tokens', 'CREATE', {});

    tokenToCreate.authToken = newAuthToken['uid'] + '_' + crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
    tokenToCreate.createdAt = tokenToCreate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['auth_tokens', tokenToCreate]);

        if (result['affectedRows']) {
            const getKey = queryBuilder('auth_tokens', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getKey, [AuthTokenSchema.select(), 'auth_tokens', tokenToCreate.authToken]);

            callback(null, { data: removeEmptyValues(rows[0]) }, 201);
        } else {
            callback(responseText({
                type: 'error',
                key: 'AUTH_TOKEN',
                code: 'ER_CREATING_TOKEN'
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

AuthTokenSchema.getAll = async (uid, pageNo, callback, debug) => {
    const perPage = 10;
    const page = pageNo == null ? 1 : pageNo;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', 'LIST_CUSTOM', {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, [AuthTokenSchema.select(), 'auth_tokens', uid]);
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

AuthTokenSchema.findByToken = async (uid, token, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', 'FIND_CUSTOM', {});

    try {
        const [rows] = await connection.query(sql, [AuthTokenSchema.select(), 'auth_tokens', uid, token]);
        if (rows.length) {
            return callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'AUTH_TOKEN',
                input: token,
                code: 'ER_TOKEN_NOT_FOUND',
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

AuthTokenSchema.update = async (uid, token, newAuthToken, callback, debug) => {
    const tokenToUpdate = removeEmptyValues(newAuthToken);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('auth_tokens', 'UPDATE', {});

    tokenToUpdate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['auth_tokens', tokenToUpdate, uid, token]);

        if (result['affectedRows']) {
            const getToken = queryBuilder('auth_tokens', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getToken, [AuthTokenSchema.select(), 'auth_tokens', token]);
            callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'AUTH_TOKEN',
                input: token,
                code: 'ER_TOKEN_NOT_FOUND',
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

AuthTokenSchema.delete = async (uid, token, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', 'DELETE', {});

    try {
        const [result] = await connection.query(sql, ['auth_tokens', uid, token]);

        if (result['affectedRows']) {
            callback(null, responseText({
                type: 'success',
                key: 'AUTH_TOKEN',
                input: token,
                code: 'MSG_TOKEN_DELETED'
            }));
        } else {
            callback(responseText({
                type: 'error',
                key: 'AUTH_TOKEN',
                input: token,
                code: 'ER_TOKEN_NOT_FOUND',
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

module.exports = AuthTokenSchema;