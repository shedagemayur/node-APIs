exports.Messages = (params) => {
    return {
        APP: {
            'NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.'
        },
        USERS: {
            'ER_DUP_ENTRY': `User with uid ${params} already exists.`,
            'ER_CREATING_USER': `Error occured while creating user.`,
            'ER_USER_NOT_FOUND': `User with uid ${params} doesn't exists.`,
            'MSG_USER_DELETED': `User ${params} was deleted successfully.`,
        },
        API_KEY: {
            'ER_API_KEY_NOT_FOUND': `Api key ${params} doesn't exists.`,
            'MSG_API_KEY_DELETED': `Api key ${params} was deleted successfully.`,
        },
        AUTH_TOKENS: {
            'ER_TOKEN_NOT_FOUND': `Auth token ${params} doesn't exists.`,
            'MSG_TOKEN_DELETED': `Auth token ${params} was deleted successfully.`,
        },
        GLOBALS: {
            'SERVER_ERROR': `Internal server error.`,
            'ER_MISSING_FIELD': `${params} field is required and can't be empty.`,
            'ER_EMPTY_FIELD': `${params} field can't be empty.`,
            'ER_EMPTY_CONTENT': `Content body can't be empty`
        }
    }
}