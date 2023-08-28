import { createReducer, on } from '@ngrx/store';
import { LoginUserDTO } from 'src/app/dtos';
import { saveAuthStateAction } from './auth.actions';

export type AuthState = {
    /** Current login user, `null` if there is no login user */
    current_user: LoginUserDTO | null;
};

export const initialAuthState: AuthState = {
    current_user: null,
};

export const authReducer = createReducer(
    initialAuthState,
    on(
        saveAuthStateAction,
        (state, action): AuthState => ({
            ...state,
            current_user: { ...action.payload },
        }),
    ),
);
