const queries = {
    FIND: `SELECT * FROM ?? WHERE uid = ?`,
    LIST: `SELECT * FROM ?? LIMIT <<startAt>>, <<perPage>>`,
    CREATE: `INSERT INTO ?? SET ?`,
    UPDATE: `UPDATE ?? SET ? WHERE uid = ?`,
    DELETE: `DELETE FROM ?? WHERE uid = ?`,
    FIND_CUSTOM: `SELECT ?? FROM ?? WHERE uid = ?`,
    LIST_CUSTOM: `SELECT ?? FROM ?? LIMIT <<startAt>>, <<perPage>>`,
}

module.exports = queries;