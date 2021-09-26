const queries = {
    'get-all-users': `SELECT * from users LIMIT <<startAt>>, <<perPage>>`,
    'get-user': `SELECT * from users WHERE uid = <<uid>>`,
    'create-user': `INSERT INTO users SET ?`
}

module.exports = queries;