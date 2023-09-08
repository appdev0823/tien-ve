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
    MYSQL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    BOOTSTRAP_TYPE_LIST: ['success', 'info', 'warning', 'danger', 'primary', 'secondary', 'dark'],
    SETTING_FIELD_NAMES: {
        INVOICE_ADDRESS: 'invoice_address',
        INVOICE_PHONE: 'invoice_phone',
    },
    REGISTER_TYPES: {
        EMAIL: 1,
        PHONE: 2,
    },
    OTP: {
        LENGTH: 6,
        EXPIRED_SECONDS: 300,
        RESEND_SECONDS: 10,
    },
    IMPORT_DEBT_TEMPLATE_NAME: 'Nhap_Cong_No.xlsx',
} as const;
Helpers.deepFreeze(CONSTANTS);

/** Application routes */
const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN: 'login',
        CHANGE_PASSWORD: 'change-password',
        REGISTER: 'register',
    },
    DASHBOARD: '',
    BANK_ACCOUNT: {
        MODULE: 'bank-account',
        LIST: '',
    },
    DEBT: {
        MODULE: 'debt',
        IMPORT: 'import',
        LIST: '',
    },
} as const;
Helpers.deepFreeze(ROUTES);

/** API routes */
const API_ROUTES = {
    AUTH: {
        REGISTER: 'auth/register',
        SAVE_ACCOUNT: 'auth/save-account',
        LOGIN: 'auth/login',
        CHANGE_PASSWORD: 'auth/change-password',
    },
    USER: {
        GET_PROFILE: 'user/profile',
        UPDATE: 'user/:id',
        GET_BY_EMAIL_PHONE: 'user/by-email-phone/:email_phone',
    },
    OTP: {
        CREATE: 'otp',
    },
    BANK: {
        LIST: 'bank',
    },
    BANK_ACCOUNT: {
        LIST: 'bank-account',
        CREATE: 'bank-account',
        UPDATE: 'bank-account/:id',
        DETAIL: 'bank-account/:id',
        DELETE: 'bank-account/:id',
    },
    DEBT: {
        CREATE_MULTIPLE: 'debt/multiple',
        LIST: 'debt',
        DETAIL: 'debt/:id',
    },
    MESSAGE: {
        LIST: 'message',
        UPDATE_DEBT_ID: 'message/:id/update-debt-id',
    },
} as const;
Helpers.deepFreeze(API_ROUTES);

export { CONSTANTS, ROUTES, API_ROUTES };
