const queries = {
    FIND: `SELECT * FROM ?? WHERE apiKey = ?`,
    LIST: `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    CREATE: `INSERT INTO ?? SET ?`,
    UPDATE: `UPDATE ?? SET ? WHERE apiKey = ?`,
    DELETE: `DELETE FROM ?? WHERE apiKey = ?`,
}

module.exports = queries;