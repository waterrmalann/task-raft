import { Id } from "@components/kanban/KanbanBoard";

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

    AUTH: {
        REGISTER_POST: '/api/user',
        LOGIN_POST: '/api/user/login',
        LOGOUT_POST: '/api/user/logout',
        MFA_POST: '/api/user/login',
    },
    VERIFICATION: {
        EMAIL_GET: (verificationCode: string, userId: string) => `/api/user/verify/${verificationCode}?uid=${userId}`,
        PWD_GET: (verificationCode: string, userId: string) => `/api/user/forget/${verificationCode}?uid=${userId}`
    },
    PROFILE: {
        GET: '/api/user/profile',
        PATCH: '/api/user/profile',
    },
    PREFERENCES: {
        PATCH: '/api/user/prefs'
    },
    DASHBOARD: {
        GET: "/api/user/dashboard"
    },
    BOARD: {
        POST: '/api/boards',
        PATCH: (boardId: string) => `/api/boards/${boardId}`,
        DELETE: (boardId: string) => `/api/boards/${boardId}`,
        GET: (boardId: string) => `/api/boards/${boardId}`,
    },
    COLLABORATOR: {
        GENERATE_POST: (boardId: string) => `/api/boards/${boardId}/collaborators/`,
        ACCEPT_GET: (boardId: string) => `/api/boards/${boardId}/collaborators/invite`,
        INVITE_GET: (boardId: string) => `/api/boards/${boardId}/collaborators/`,
        PATCH: (boardId: string, collaboratorId: string) => `/api/boards/${boardId}/collaborators/${collaboratorId}`,
        DELETE: (boardId: string, collaboratorId: string) => `/api/boards/${boardId}/collaborators/${collaboratorId}`,
    },
    LIST: {
        POST: (boardId: string) => `/api/boards/${boardId}/lists`,
        PATCH: (boardId: string, listId: Id) => `/api/boards/${boardId}/lists/${listId}`,
        DELETE: (boardId: string, listId: Id) => `/api/boards/${boardId}/lists/${listId}`,
    },
    CARD: {
        POST: (boardId: string) => `/api/boards/${boardId}/cards`,
        PATCH: (boardId: string, cardId: Id) => `/api/boards/${boardId}/cards/${cardId}`,
        PUT: (boardId: string, cardId: Id) => `/api/boards/${boardId}/cards/${cardId}`,
        DELETE: (boardId: string, cardId: Id) => `/api/boards/${boardId}/cards/${cardId}`,
    },
};
