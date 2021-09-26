const queryBuilder = require('../helpers/queryBuilder');
const APIs = require('../constants/apis');

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
        const [rows] = await connection.execute(sql);
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).send({
            error: 'SERVER_ERROR',
            errorMessage: 'Internal server error'
        });
    }
    finally {
        connection.release();
    }
};