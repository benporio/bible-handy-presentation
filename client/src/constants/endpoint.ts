enum Endpoint {
    AUTH_LOGIN = '/auth/login',
    AUTH_REGISTER = '/auth/register',
    AUTH_VALIDATE = '/auth/validate',
    AUTH_LOGOUT = '/auth/logout',
    AUTH_ACCESS_TOKEN = '/auth/access-token',

    USER_PROFILE = '/user/profile',

    BIBLE_SEARCH_FETCH_BOOKS = '/bs/books',
    BIBLE_SEARCH_FETCH_VERSIONS = '/bs/versions',
    BIBLE_SEARCH_PASSAGE = '/bs/passage',
    BIBLE_BROADCAST_PASSAGE = '/bs/passage/broadcast',
    BIBLE_PASSAGE_SAVE_PRESET = '/bs/passage/preset',
    BIBLE_PASSAGE_SAVE_HISTORY = '/bs/passage/history',
    BIBLE_LOAD_BHP_USER = '/bs/user',
}

export default Endpoint;