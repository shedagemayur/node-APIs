const queries = {
    'getUser': `SELECT * FROM ?? WHERE uid = ?`,
    'listUsers': `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    'createUser': `INSERT INTO ?? SET ?`,
    'deleteUser': `DELETE FROM ?? WHERE uid = ?`,
    'updateUser': `UPDATE ?? SET ? WHERE uid = ?`,
}

module.exports = queries;