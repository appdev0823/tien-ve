import { Helpers } from 'src/utils';

const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN_OTP: 'login-otp',
        SAVE_ACCOUNT: 'save-account',
    },
    MESSAGE: {
        MODULE: 'message',
        CREATE: '',
        LIST: '',
    },
    USER: {
        MODULE: 'user',
        PROFILE: 'profile',
    },
    OTP: {
        MODULE: 'otp',
        CREATE: '',
        IS_VALID: 'is-valid',
    },
} as const;
Helpers.deepFreeze(ROUTES);

export default ROUTES;
