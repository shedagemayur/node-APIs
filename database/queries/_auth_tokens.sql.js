const queries = {
    'getToken': `SELECT * FROM ?? WHERE authToken = ?`,
    'listTokens': `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    'createToken': `INSERT INTO ?? SET ?`,
    'deleteToken': `DELETE FROM ?? WHERE authToken = ?`,
    'updateToken': `UPDATE ?? SET ? WHERE authToken = ?`,
}

module.exports = queries;