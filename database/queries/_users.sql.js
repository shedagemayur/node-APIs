const queries = {
    'getUser': `SELECT * FROM ?? WHERE uid = ?`,
    'listUsers': `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    'createUser': `INSERT INTO users SET ?`
}

module.exports = queries;