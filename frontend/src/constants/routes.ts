export const API_ROUTES = {
    /* AUTH ROUTES */
    POST_REGISTER_USER: '/api/user',
    POST_LOGIN_USER: '/api/user/login',
    POST_LOGOUT_USER: '/api/user/logout',

    POST_LOGIN_USER_MFA: '/api/user/login',
    POST_VERIFY_EMAIL: '/api/user/verify/',

    /* PROFILE ROUTES */
    GET_USER: '/api/user',
    GET_USER_PROFILE: '/api/user/profile',
    PATCH_USER_PROFILE: '/api/user/profile',
    PATCH_USER_PREFS: '/api/user/prefs',
};
