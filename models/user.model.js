const queryBuilder = require('../helpers/queryBuilder');
const { responseText, removeEmptyValues } = require('../helpers/responseProcessor');

const UserResponse = function (user) {
    this.uid = user.uid;
    this.name = user.name;
    this.role = user.role;
    this.status = user.status;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
}

const UpdateUserResponse = function (user) {
    UserResponse.call(this, user);
    this.updatedAt = user.updatedAt;
}

const UserSchema = function (user) {
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

UserSchema.select = (custom = []) => {
    if (custom.length) return custom;
    return ['uid', 'name', 'avatar', 'role', 'status', 'createdAt'];
}

UserSchema.create = async (newUser, callback, debug) => {
    const userToCreate = removeEmptyValues(newUser);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('users', 'CREATE', {});

    userToCreate.createdAt = userToCreate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['users', userToCreate]);

        if (result['affectedRows']) {
            const getUser = queryBuilder('users', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getUser, [UserSchema.select(), 'users', userToCreate.uid]);

            callback(null, { data: removeEmptyValues(rows[0]) }, 201);
        } else {
            callback(responseText({
                type: 'error',
                key: 'USERS',
                code: 'ER_CREATING_USER'
            }), null, 500);
        }
    } catch (e) {
        if (typeof (e) == 'object' && e.hasOwnProperty('code') && e.code == 'ER_DUP_ENTRY') {
            callback(responseText({
                type: 'error',
                key: 'USERS',
                code: 'ER_DUP_ENTRY',
                input: userToCreate.uid,
                trace: e
            }, debug), null, 409);
        } else {
            callback(responseText({
                type: 'error',
                key: 'GLOBALS',
                code: 'SERVER_ERROR',
                trace: e
            }, debug), null, 500);
        }
    }
    finally {
        connection.release();
    }
};

UserSchema.getAll = async (pageNo, callback, debug) => {
    const perPage = 10;
    const page = pageNo == null ? 1 : pageNo;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('users', 'LIST_CUSTOM', {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, [UserSchema.select(), 'users']);
        if (rows.length == 0) return callback(null, rows);

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

UserSchema.findByUID = async (uid, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('users', 'FIND_CUSTOM', {});

    try {
        const [rows] = await connection.query(sql, [UserSchema.select(), 'users', uid]);
        if (rows.length) {
            return callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'USERS',
                input: uid,
                code: 'ER_USER_NOT_FOUND',
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

UserSchema.update = async (uid, newUser, callback, debug) => {
    const userToCreate = removeEmptyValues(newUser);

    const connection = await connectionPool.getConnection();
    const sql = queryBuilder('users', 'UPDATE', {});

    userToCreate.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [result] = await connection.query(sql, ['users', userToCreate, uid]);

        if (result['affectedRows']) {
            const getUser = queryBuilder('users', 'FIND_CUSTOM', {});
            const [rows] = await connection.query(getUser, [UserSchema.select(), 'users', uid]);
            callback(null, { data: removeEmptyValues(rows[0]) });
        } else {
            callback(responseText({
                type: 'error',
                key: 'USERS',
                input: uid,
                code: 'ER_USER_NOT_FOUND',
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

UserSchema.delete = async (uid, callback, debug) => {
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder('users', 'DELETE', {});

    try {
        const [result] = await connection.query(sql, ['users', uid]);

        if (result['affectedRows']) {
            callback(null, responseText('sucess', 'USERS', 'MSG_USER_DELETED', uid));
        } else {
            callback(responseText({
                type: 'error',
                key: 'USERS',
                input: uid,
                code: 'ER_USER_NOT_FOUND',
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

module.exports = UserSchema;

