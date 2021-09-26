const queryBuilder = require('../helpers/queryBuilder');
const { getErrorMessage } = require('../helpers/errorMessage');
const APIs = require('../constants/apis');

exports.createUser = async (req, res) => {
    const requireFileds = ['uid', 'name'];
    if (!validateUser(requireFileds, req.body, res)) return;

    let user = req.body;

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.CREATE, {});
    user.createdAt = user.updatedAt = Math.floor(+new Date() / 1000);

    try {
        const [rows] = await connection.query(sql, user);

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
            message: getErrorMessage('USERS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

exports.getAllUsers = async (req, res) => {
    const perPage = 10;
    const page = req.query.page == null ? 1 : req.query.page;
    const startAt = perPage * (page - 1);

    const connection = await connectionPool.getConnection();

    const sql = queryBuilder(APIs.USERS.ALL, {
        'startAt': connection.escape(startAt),
        'perPage': connection.escape(perPage)
    });
    try {
        const [rows] = await connection.query(sql, ['users']);
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).send({
            error: 'SERVER_ERROR',
            message: getErrorMessage('USERS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

exports.getUser = async (req, res) => {
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
            message: getErrorMessage('USERS', 'SERVER_ERROR')
        });
    }
    finally {
        connection.release();
    }
};

const validateUser = (fields, body, res) => {
    let isValid = true;

    let missingRequiredFields = fields.filter(x => !Object.keys(body).includes(x));

    if (missingRequiredFields.length) {
        isValid = false;
        res.status(200).send({
            error: 'ERR_MISSING_FIELD',
            message: getErrorMessage('USERS', 'ERR_MISSING_FIELD', missingRequiredFields[0])
        });
    }

    Object.keys(body).forEach(field => {
        if (fields.indexOf(field) !== -1) {
            if (!body[field].trim()) {
                isValid = false;
                res.status(200).send({
                    error: 'ERR_EMPTY_FIELD',
                    message: getErrorMessage('USERS', 'ERR_EMPTY_FIELD', field)
                });
                return;
            }
        }
    });
    return isValid;
};