const queryBuilder = require('../helpers/queryBuilder');
const { getErrorMessage } = require('../helpers/errorMessage');
const APIs = require('../constants/apis');

exports.createUser = async (req, res) => {
    const requireFileds = ['uid', 'name'];
    if (!checkRequestBody(requireFileds, req.body, res)) return;

    let user = req.body;

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CREATE, {});
    user.createdAt = user.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [rows] = await connection.query(sql, ['users', user]);

        res.status(201).json([user]);
    } catch (e) {
        if (typeof (e) == 'object' && e.hasOwnProperty('code') && e.code == 'ER_DUP_ENTRY') {
            return res.status(409).send({
                error: 'ER_DUP_ENTRY',
                message: getErrorMessage('USERS', 'ER_DUP_ENTRY', user.uid)
            });
        }
        console.log(e);
        res.status(500).send({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

exports.listUsers = async (req, res) => {
    const perPage = 10;
    const page = req.query.page == null ? 1 : req.query.page;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.LIST, {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['users']);
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).send({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

exports.getUser = async (req, res, next) => {
    const uid = req.params.uid;
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CURRENT, {});

    try {
        const [rows] = await connection.query(sql, ['users', uid]);
        if (rows.length) return res.status(200).json(rows);

        res.status(404).json(rows);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

exports.updateUser = () => {

};

exports.deleteUser = async (req, res) => {
    const uid = req.params.uid;
    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CURRENT, {});

    try {
        const [rows] = await connection.query(sql, ['users', uid]);
        if (rows.length) {
            const sql = queryBuilder(APIs.USERS.DELETE, {});
            await connection.query(sql, ['users', uid]);

            res.status(204);
        } else {
            return res.status(404).json({
                error: 'ER_USER_NOT_FOUND',
                message: getErrorMessage('USERS', 'ER_USER_NOT_FOUND', uid)
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: 'SERVER_ERROR',
            message: getErrorMessage('GLOBALS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
}

const checkRequestBody = (fields, reqBody, res) => {
    let isValid = true;

    fields.forEach(property => {
        if (!reqBody.hasOwnProperty(property)) {
            // required field missing
            isValid = false;
            return res.status(200).send({
                error: 'ER_MISSING_FIELD',
                message: getErrorMessage('GLOBALS', 'ER_MISSING_FIELD', property)
            });
        }
        if (reqBody.hasOwnProperty(property) && !reqBody[property]) {
            // required field is empty
            isValid = false;
            return res.status(200).send({
                error: 'ER_EMPTY_FIELD',
                message: getErrorMessage('GLOBALS', 'ER_EMPTY_FIELD', property)
            });
        }
    });

    return isValid;
};