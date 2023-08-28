import { createAction, props } from '@ngrx/store';
import { LoginUserDTO } from 'src/app/dtos';

export enum AuthActionTypes {
    SAVE = '[Auth] SAVE',
}

export const saveAuthStateAction = createAction(AuthActionTypes.SAVE, props<{ payload: LoginUserDTO }>());
