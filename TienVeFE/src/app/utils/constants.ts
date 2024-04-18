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
        UPGRADE_NOTE: 'upgrade_note',
        REMIND_MESSAGE_TEMPLATE: 'remind_message_template',
        APP_LINK: 'app_link',
        DEFAULT_SMS_RECEIVE_PHONE: 'default_sms_receive_phone',
    },
    REGISTER_TYPES: {
        EMAIL: 1,
        PHONE: 2,
    },
    OTP: {
        LENGTH: 6,
        EXPIRED_SECONDS: 600,
        RESEND_SECONDS: 10,
    },
    IMPORT_DEBT_TEMPLATE_NAME: 'Nhap_Cong_No.xlsx',
    BANK_ACCOUNT_STATUSES: {
        /** Ngừng kích hoạt */
        DEACTIVATED: -1,
        /** Chưa kích hoạt */
        NOT_ACTIVATED: 0,
        /** Đã kích hoạt */
        ACTIVATED: 1,
    },
    DEBT_ID_FORMAT: {
        PREFIX: 'TV',
        SEPARATOR: '-',
        DATE_FORMAT: 'DDMMYY',
        USER_ID_LENGTH: 5,
        AUTO_INCREMENT_LENGTH: 5,
        LENGTH: 21,
    },
    REMIND_MESSAGE: {
        CHANNEL_TYPE: {
            ZALO: 1,
            SMS: 2,
        },
        STATUS: {
            FAIL: -1,
            SENDING: 0,
            SUCCESS: 1,
        },
    },
    PRIMARY_COLOR: '#D82D8B',
    EXCEL_FILE_NAME: {
        DEBT_LIST: 'Danh sách công nợ',
        MESSAGE_LIST: 'Danh sách tin nhắn giao dịch',
    },
} as const;
Helpers.deepFreeze(CONSTANTS);

/** Application routes */
const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN: 'login',
        REGISTER: 'register',
        FORGOT_PASSWORD: 'forgot-password',
        CHANGE_PASSWORD: 'change-password',
    },
    DASHBOARD: '',
    BANK_ACCOUNT: {
        MODULE: 'bank-account',
        LIST: '',
    },
    // DEBT: {
    //     MODULE: 'debt',
    //     IMPORT: 'import',
    //     LIST: '',
    // },
    MESSAGE: {
        MODULE: 'message',
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
        VALIDATE_FORGOT_PASSWORD_OTP: 'auth/validate-forgot-password-otp',
        RENEW_PASSWORD: 'auth/renew-password',
    },
    USER: {
        GET_PROFILE: 'user/profile',
        UPDATE: 'user/:id',
        GET_BY_EMAIL_PHONE: 'user/by-email-phone/:email_phone',
        GET_TODAY_DEBT_COUNT: 'user/today-debt-count',
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
        DELETE_MULTIPLE: 'bank-account',
        DELETE: 'bank-account/:id',
    },
    DEBT: {
        CREATE_MULTIPLE: 'debt/multiple',
        LIST: 'debt',
        DETAIL: 'debt/:id',
        DELETE_MULTIPLE: 'debt',
        UPDATE: 'debt/:id',
        REMIND: 'debt/remind',
    },
    MESSAGE: {
        LIST: 'message',
        DETAIL: 'message/:id',
        UPDATE_DEBT_ID: 'message/:id/update-debt-id',
        DELETE_MULTIPLE: 'message',
        AMOUNT_MONTHLY_STATS: 'message/amount-monthly-stats',
        AMOUNT_DAILY_STATS: 'message/amount-daily-stats',
    },
    REMIND_MESSAGE: {
        LIST: 'remind-message',
        DETAIL: 'remind-message/:id',
        DELETE_MULTIPLE: 'remind-message',
    },
    SETTING: {
        MODULE: 'setting',
        GET_LIST_BY_FIELD_NAME_LIST: 'setting/list-by-field-name-list',
        UPDATE_MULTIPLE: 'setting/update-multiple',
    },
} as const;
Helpers.deepFreeze(API_ROUTES);

export { CONSTANTS, ROUTES, API_ROUTES };
