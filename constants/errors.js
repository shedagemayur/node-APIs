exports.MESSAGES = (params = '') => {
    return {
        APP: {
            'NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.'
        },
        USERS: {
            'SERVER_ERROR': `Internal server error.`
        }
    }
}