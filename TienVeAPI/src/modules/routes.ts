import { Helpers } from 'src/utils';

const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        REGISTER: 'register',
        LOGIN: 'login',
        SAVE_ACCOUNT: 'save-account',
        CHANGE_PASSWORD: 'change-password',
        VALIDATE_FORGOT_PASSWORD_OTP: 'validate-forgot-password-otp',
        RENEW_PASSWORD: 'renew-password',
    },
    MESSAGE: {
        MODULE: 'message',
        CREATE: '',
        LIST: '',
        DETAIL: ':id',
        DELETE_MULTIPLE: '',
        UPDATE_DEBT_ID: ':id/update-debt-id',
        AMOUNT_MONTHLY_STATS: 'amount-monthly-stats',
        AMOUNT_DAILY_STATS: 'amount-daily-stats',
    },
    REMIND_MESSAGE: {
        MODULE: 'remind-message',
        LIST: '',
        DETAIL: ':id',
        DELETE_MULTIPLE: '',
    },
    USER: {
        MODULE: 'user',
        PROFILE: 'profile',
        GET_BY_EMAIL_PHONE: 'by-email-phone/:email_phone',
        GET_TODAY_DEBT_COUNT: 'today-debt-count',
    },
    OTP: {
        MODULE: 'otp',
        CREATE: '',
    },
    BANK: {
        MODULE: 'bank',
        LIST: '',
    },
    BANK_ACCOUNT: {
        MODULE: 'bank-account',
        LIST: '',
        DETAIL: ':id',
        CREATE: '',
        UPDATE: ':id',
        DELETE_MULTIPLE: '',
        DELETE: ':id',
    },
    DEBT: {
        MODULE: 'debt',
        LIST: '',
        DETAIL: ':id',
        CREATE_MULTIPLE: 'multiple',
        REMIND: 'remind',
        UPDATE: ':id',
        DELETE_MULTIPLE: '',
        DELETE: ':id',
    },
    SETTING: {
        MODULE: 'setting',
        GET_LIST_BY_FIELD_NAME_LIST: 'list-by-field-name-list',
        UPDATE_MULTIPLE: 'update-multiple',
    },
    TEST: {
        MODULE: 'test',
        INDEX: '',
    },
} as const;
Helpers.deepFreeze(ROUTES);

export default ROUTES;
