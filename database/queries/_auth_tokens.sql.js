const queries = {
    FIND: `SELECT * FROM ?? WHERE authToken = ?`,
    LIST: `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    CREATE: `INSERT INTO ?? SET ?`,
    UPDATE: `UPDATE ?? SET ? WHERE authToken = ?`,
    DELETE: `DELETE FROM ?? WHERE authToken = ?`,
}

module.exports = queries;