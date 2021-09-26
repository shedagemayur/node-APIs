const queries = {
    'get-user': `SELECT * FROM ?? WHERE uid = ?`,
    'get-all-users': `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    'create-user': `INSERT INTO users SET ?`
}

module.exports = queries;