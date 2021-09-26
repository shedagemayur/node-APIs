exports.MESSAGES = (params) => {
    return {
        APP: {
            'NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.'
        },
        USERS: {
            'SERVER_ERROR': `Internal server error.`,
            'ER_DUP_ENTRY': `User with uid ${params} already exists.`,
            'ERR_MISSING_FIELD': `${params} field is required.`,
            'ERR_EMPTY_FIELD': `${params} field can't be empty.`
        }
    }
}