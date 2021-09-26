const queries = {
    'get-all-users': `SELECT * from users LIMIT {startAt}, {perPage}`
}

module.exports = queries;