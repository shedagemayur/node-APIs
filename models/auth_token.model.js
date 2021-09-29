const APIs = require('../constants/apis');
const queryBuilder = require('../helpers/queryBuilder');
const { responseText } = require('../helpers/responseProcessor');

function AuthToken(user) {
    this.authToken = user.authToken;
    this.uid = user.uid;
    this.deviceId = user.deviceId;
    this.apiKey = user.apiKey;
    this.plateform = user.plateform;
    this.userAgent = user.userAgent;
    this.appInfo = user.appInfo;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
}

AuthToken.create = async (newAuthToken, callback) => {
    Object.keys(newAuthToken).forEach((key) => newAuthToken[key] === undefined && delete newAuthToken[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.CREATE, {});

    newAuthToken.createdAt = newAuthToken.updatedAt = Math.floor(+new Date() / 1000);

    try {
        await connection.query(sql, ['auth_tokens', newAuthToken]);
        callback(null, { ...newAuthToken }, 201);
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

AuthToken.getAll = async (pageNo, callback) => {
    const perPage = 10;
    const page = pageNo == null ? 1 : pageNo;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.LIST, {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['auth_tokens']);
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

AuthToken.findByToken = async (token, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.CURRENT, {});

    try {
        const [rows] = await connection.query(sql, ['auth_tokens', token]);
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

AuthToken.update = async (token, newAuthToken, callback) => {
    Object.keys(newAuthToken).forEach((key) => newAuthToken[key] === undefined && delete newAuthToken[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.UPDATE, {});

    newAuthToken.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['auth_tokens', newAuthToken, token]);

        if (result['affectedRows']) {
            const getToken = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.CURRENT, {});
            const [rows] = await connection.query(getToken, ['auth_tokens', token]);
            callback(null, rows);
        } else {
            callback({
                error: 'ER_TOKEN_NOT_FOUND',
                details: responseText('AUTH_TOKENS', 'ER_TOKEN_NOT_FOUND', token)
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

AuthToken.delete = async (token, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('auth_tokens', APIs.AUTH_TOKEN.DELETE, {});

    try {
        const [result] = await connection.query(sql, ['auth_tokens', token]);

        if (result['affectedRows']) {
            callback(null, {
                success: true,
                details: responseText('AUTH_TOKEN', 'MSG_TOKEN_DELETED', token)
            });
        } else {
            callback({
                error: 'ER_TOKEN_NOT_FOUND',
                details: responseText('AUTH_TOKEN', 'ER_TOKEN_NOT_FOUND', token)
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

module.exports = AuthToken;