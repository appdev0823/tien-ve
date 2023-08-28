import { AuthState, authReducer } from './auth/auth.reducers';

export type AppState = {
    auth: AuthState;
};

export const reducers = {
    auth: authReducer,
};
