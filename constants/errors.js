exports.Messages = (params) => {
    return {
        APP: {
            'NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.'
        },
        USERS: {
            'ER_DUP_ENTRY': `User with uid ${params} already exists.`,
            'ER_USER_NOT_FOUND': `User with uid ${params} doen't exists.`,
            'MSG_USER_DELETED': `User ${params} was deleted successfully.`,
        },
        GLOBALS: {
            'SERVER_ERROR': `Internal server error.`,
            'ER_MISSING_FIELD': `${params} field is required and can't be empty.`,
            'ER_EMPTY_FIELD': `${params} field can't be empty.`,
            'ER_EMPTY_CONTENT': `Content body can't be empty`
        }
    }
}