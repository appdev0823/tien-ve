import { Helpers } from 'src/utils';

const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN: 'login',
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
} as const;
Helpers.deepFreeze(ROUTES);

export default ROUTES;
