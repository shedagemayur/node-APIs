const queryBuilder = require('../helpers/queryBuilder');
const { responseText } = require('../helpers/responseProcessor');

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

User.create = async (newCustomer, callback) => {
    Object.keys(newCustomer).forEach((key) => newCustomer[key] === undefined && delete newCustomer[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('users', 'CREATE', {});

    newCustomer.createdAt = newCustomer.updatedAt = Math.floor(+new Date() / 1000);

    try {
        await connection.query(sql, ['users', newCustomer]);
        callback(null, { ...newCustomer }, 201);
    } catch (e) {
        if (typeof (e) == 'object' && e.hasOwnProperty('code') && e.code == 'ER_DUP_ENTRY') {
            callback({
                error: 'ER_DUP_ENTRY',
                details: responseText('USERS', 'ER_DUP_ENTRY', newCustomer.uid)
            }, null, 409);
        } else {
            callback({
                error: 'SERVER_ERROR',
                details: responseText('GLOBALS', 'SERVER_ERROR')
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

    const sql = queryBuilder('users', 'LIST', {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['users']);
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

User.findByUID = async (uid, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('users', 'FIND', {});

    try {
        const [rows] = await connection.query(sql, ['users', uid]);
        if (rows.length) return callback(null, rows);

        callback({
            error: 'ER_USER_NOT_FOUND',
            details: responseText('USERS', 'ER_USER_NOT_FOUND', uid)
        }, null, 404);
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

User.update = async (uid, newCustomer, callback) => {
    Object.keys(newCustomer).forEach((key) => newCustomer[key] === undefined && delete newCustomer[key]);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('users', 'UPDATE', {});

    newCustomer.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['users', newCustomer, uid]);

        if (result['affectedRows']) {
            const getUser = queryBuilder('users', 'FIND', {});
            const [rows] = await connection.query(getUser, ['users', uid]);
            callback(null, rows);
        } else {
            callback({
                error: 'ER_USER_NOT_FOUND',
                details: responseText('USERS', 'ER_USER_NOT_FOUND', uid)
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

User.delete = async (uid, callback) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('users', 'DELETE', {});

    try {
        const [result] = await connection.query(sql, ['users', uid]);

        if (result['affectedRows']) {
            callback(null, {
                success: true,
                details: responseText('USERS', 'MSG_USER_DELETED', uid)
            });
        } else {
            callback({
                error: 'ER_USER_NOT_FOUND',
                details: responseText('USERS', 'ER_USER_NOT_FOUND', uid)
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

User.validate = (requiredProperties, newCustomer) => {
    for (var i = 0; i < Object.keys(newCustomer).length; i++) {
        if (newCustomer.hasOwnProperty(requiredProperties[i]) && newCustomer[requiredProperties[i]] === undefined || newCustomer[requiredProperties[i]] == '') {
            return {
                error: 'ER_MISSING_FIELD',
                details: responseText('GLOBALS', 'ER_MISSING_FIELD', requiredProperties[i])
            };
        }
    }
    return false;
};

module.exports = User;

