exports.Messages = (params) => {
    return {
        APP: {
            'ER_APP_NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.',
            'ER_ECONNREFUSED': `Unable to connect to caching server.`
        },
        USERS: {
            'ER_DUP_ENTRY': `User with uid ${params} already exists.`,
            'ER_CREATING_USER': `Error occured while creating user.`,
            'ER_USER_NOT_FOUND': `User with uid ${params} doesn't exists.`,
            'MSG_USER_DELETED': `User ${params} has been deleted successfully.`,
        },
        API_KEY: {
            'ER_AUTH_NO_ACCESS': `The Key ${params} cannot be used to perform this operation. Please use API key with a correct scope to perform the operation.`,
            'ER_API_KEY_NOT_FOUND': `The Key ${params} doesn't exists.`,
            'ER_CREATING_API_KEY': `Error occured while creating Api Key.`,
            'MSG_API_KEY_DELETED': `The Key ${params} has been deleted successfully.`,
        },
        AUTH_TOKENS: {
            'ER_TOKEN_NOT_FOUND': `Auth token ${params} doesn't exists.`,
            'MSG_TOKEN_DELETED': `Auth token ${params} has been deleted successfully.`,
        },
        GLOBALS: {
            'SERVER_ERROR': `Internal server error.`,
            'ER_MISSING_FIELD': `${params} field is required and can't be empty.`,
            'ER_EMPTY_FIELD': `${params} field can't be empty.`,
            'ER_EMPTY_CONTENT': `Content body can't be empty`
        }
    }
}