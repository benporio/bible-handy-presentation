enum Endpoint {
    AUTH = '/auth',
    AUTH_LOGIN = '/login',
    AUTH_REGISTER = '/register',
    AUTH_VALIDATE = '/validate',
    AUTH_LOGOUT = '/logout',
    AUTH_ACCESS_TOKEN = '/access-token',

    USER = '/user',
    USER_PROFILE = '/profile',

    BIBLE_SEARCH = '/bs',
    BIBLE_SEARCH_FETCH_BOOKS = '/books',
    BIBLE_SEARCH_FETCH_VERSIONS = '/versions',
    BIBLE_SEARCH_PASSAGE = '/passage',
    BIBLE_BROADCAST_PASSAGE = '/passage/broadcast',
    BIBLE_PASSAGE_SAVE_PRESET = '/passage/preset',
    BIBLE_PASSAGE_SAVE_HISTORY = '/passage/history',
    BIBLE_LOAD_BHP_USER = '/user',
}

export default Endpoint;