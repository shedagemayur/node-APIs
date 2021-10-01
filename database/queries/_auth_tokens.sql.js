const queries = {
    FIND: `SELECT * FROM ?? WHERE authToken = ?`,
    LIST: `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    CREATE: `INSERT INTO ?? SET ?`,
    UPDATE: `UPDATE ?? SET ? WHERE uid = ? AND authToken = ?`,
    DELETE: `DELETE FROM ?? WHERE uid = ? AND authToken = ?`,
    FIND_CUSTOM: `SELECT ?? FROM ?? WHERE uid = ? AND authToken = ?`,
    LIST_CUSTOM: `SELECT ?? FROM ?? WHERE uid = ? LIMIT <<startAt>>, <<perPage>>`,
}

module.exports = queries;