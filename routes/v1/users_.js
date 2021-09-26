const queryBuilder = require('../../helpers/queryBuilder');
const { stablishedConnection, closeDbConnection } = require('../../database/connection');
const APIs = require('../../constants/apis');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const perPage = 10;
    const page = req.query.page == null ? 1 : req.query.page;
    const startAt = perPage * (page - 1);

    const sql = queryBuilder(APIs.USERS.ALL, {
        'startAt': startAt,
        'perPage': perPage
    });
    await stablishedConnection(req.headers.app_id).then(async (connection) => {
        await connection.promise().query(sql).then(
            ([rows, fields]) => {
                res.status(200).json(rows);
            }).then(() => {
                connection.end();
                closeDbConnection(connection);
            });
    }).catch((error) => {
        console.log(error.sqlMessage);
        res.status(404).json({
            error: 'NOT_FOUND',
            errorMessage: 'Invalid APP_ID'
        })
    });

    next();
});

module.exports = router;