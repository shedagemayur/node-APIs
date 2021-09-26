exports.MESSAGES = (params = '') => {
    return {
        APP: {
            'NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.'
        }
    }
}