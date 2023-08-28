import Helpers from './helpers';

/** Application constants */
const CONSTANTS = {
    DEFAULT_LANG: 'vi',
    /** Error message CSS class */
    ERROR_MESSAGE_CLASS: 'app-error-message',
    /** Default internal server error message */
    ERR_INTERNAL_SERVER_ERROR: 'err_internal_server_error',
    /** `localStorage` key name of access token */
    LS_ACCESS_TOKEN_KEY: 'tien_ve_access_token',
    /** Total items per page */
    PAGE_SIZE: 20,
    /** Max page count to be displayed in pagination */
    MAX_PAGE_COUNT: 5,
    USER_ROLES: {
        REGULAR: 0,
        ADMIN: 1,
    },
    BOOTSTRAP_TYPE_LIST: ['success', 'info', 'warning', 'danger', 'primary', 'secondary', 'dark'],
    SETTING_FIELD_NAMES: {
        INVOICE_ADDRESS: 'invoice_address',
        INVOICE_PHONE: 'invoice_phone',
    },
} as const;
Helpers.deepFreeze(CONSTANTS);

/** Application routes */
const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN: 'login',
        CHANGE_PASSWORD: 'change-password',
    },
    DASHBOARD: '',
    INVOICE: {
        MODULE: 'invoice',
        LIST: '',
        CREATE: 'create',
        UPDATE_INFO: 'update-info',
    },
    REPORT: {
        MODULE: 'report',
        SUMMARY: '',
        DAILY: 'daily',
    },
    PRODUCT: {
        MODULE: 'product',
        LIST: '',
    },
    USER: {
        MODULE: 'user',
        LIST: '',
    },
} as const;
Helpers.deepFreeze(ROUTES);

/** API routes */
const API_ROUTES = {
    AUTH: {
        LOGIN: 'auth/login',
        CHANGE_PASSWORD: 'auth/change-password',
    },
    USER: {
        GET_PROFILE: 'user/profile',
        LIST: 'user',
        CREATE: 'user',
        UPDATE: 'user/:username',
        DETAIL: 'user/:username',
        TOGGLE: 'user/toggle/:username',
    },
    PRODUCT: {
        LIST: 'product',
        STATS_LIST: 'product/stats-list',
        CREATE: 'product',
        UPDATE: 'product/:id',
        DETAIL: 'product/:id',
        DELETE: 'product/:id',
        UPDATE_ORDER: 'product/update-order',
    },
    INVOICE: {
        LIST: 'invoice',
        DETAIL: 'invoice/:id',
        CREATE: 'invoice',
        DELETE: 'invoice/:id',
        TOTAL_STATS: 'invoice/total-stats',
        DATE_STATS_LIST: 'invoice/date-stats-list',
        MONTH_STATS_LIST: 'invoice/month-stats-list',
        CUSTOMER_LIST: 'invoice/customer-list',
    },
    SETTING: {
        GET_LIST_BY_FIELD_NAME_LIST: 'setting/list-by-field-name-list',
        UPDATE_MULTIPLE: 'setting/update-multiple',
    },
} as const;
Helpers.deepFreeze(API_ROUTES);

export { CONSTANTS, ROUTES, API_ROUTES };
