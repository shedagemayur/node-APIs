const queries = {
    FIND: `SELECT * FROM ?? WHERE apiKey = ?`,
    LIST: `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    CREATE: `INSERT INTO ?? SET ?`,
    UPDATE: `UPDATE ?? SET ? WHERE apiKey = ?`,
    DELETE: `DELETE FROM ?? WHERE apiKey = ?`,
    FIND_CUSTOM: `SELECT ?? FROM ?? WHERE apiKey = ?`,
    LIST_CUSTOM: `SELECT ?? FROM ?? LIMIT <<startAt>>, <<perPage>>`,
}

module.exports = queries;