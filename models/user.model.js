const queryBuilder = require('../helpers/queryBuilder');
const { getErrorMessage } = require('../helpers/errorMessage');
const APIs = require('../constants/apis');

function User(user) {
    this.uid = user.uid;
    this.name = user.name;
    this.link = user.link;
    this.role = user.role;
    this.avatar = user.avatar;
    this.status = user.status;
    this.credits = user.credits;
    this.metadata = user.metadata;
    this.createdBy = user.createdBy;
    this.updatedBy = user.updatedBy;
    this.deletedBy = user.deletedBy;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.lastActiveAt = user.lastActiveAt;
    this.statusMessage = user.statusMessage;
}

User.validate = (requiredProperties, newCustomer) => {
    for (var i = 0; i < Object.keys(newCustomer).length; i++) {
        if (newCustomer.hasOwnProperty(requiredProperties[i]) && newCustomer[requiredProperties[i]] === undefined || newCustomer[requiredProperties[i]] == '') {
            return {
                error: 'ER_MISSING_FIELD',
                message: getErrorMessage('GLOBALS', 'ER_MISSING_FIELD', requiredProperties[i])
            };
        }
    }
    return false;
};

User.create = async (newCustomer, callback) => {
    Object.keys(newCustomer).forEach((key) => newCustomer[key] === undefined && delete newCustomer[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder(APIs.USERS.CREATE, {});

    newCustomer.createdAt = newCustomer.updatedAt = Math.floor(+new Date() / 1000);

    try {
        await connection.query(sql, ['users', newCustomer]);
        callback(null, { ...newCustomer }, 201);
    } catch (e) {
        if (typeof (e) == 'object' && e.hasOwnProperty('code') && e.code == 'ER_DUP_ENTRY') {
            callback({
                error: 'ER_DUP_ENTRY',
                message: getErrorMessage('USERS', 'ER_DUP_ENTRY', newCustomer.uid)
            }, null, 409);
        } else {
            callback({
                error: 'SERVER_ERROR',
                message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
            }, null, 500);
        }
    }
    finally {
        connection.release();
    }
};

User.getAll = async (pageNo, callback) => {
    const perPage = 10;
    const page = pageNo == null ? 1 : pageNo;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.LIST, {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['users']);
        callback(null, rows);
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

User.findByUID = async (uid, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CURRENT, {});

    try {
        const [rows] = await connection.query(sql, ['users', uid]);
        if (rows.length) return callback(null, rows);

        callback(null, rows, 404);
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

User.update = async (uid, newCustomer, callback) => {
    Object.keys(newCustomer).forEach((key) => newCustomer[key] === undefined && delete newCustomer[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder(APIs.USERS.UPDATE, {});

    newCustomer.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [rows] = await connection.query(sql, ['users', newCustomer, uid]);
        callback(null, { ...newCustomer }, 201);
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

User.delete = async (uid, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CURRENT, {});

    try {
        const [rows] = await connection.query(sql, ['users', uid]);

        if (rows.length) {
            const sql = queryBuilder(APIs.USERS.DELETE, {});
            await connection.query(sql, ['users', uid]);

            callback(null, rows, 204);
        } else {
            callback({
                error: 'ER_USER_NOT_FOUND',
                message: getErrorMessage('USERS', 'ER_USER_NOT_FOUND', uid)
            }, null, 404);
        }
    } catch (e) {
        callback({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        }, null, 500);
    }
    finally {
        connection.release();
    }
};

module.exports = User;
