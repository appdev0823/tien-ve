import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { LoginUserDTO } from 'src/app/dtos';
import { CONSTANTS, Helpers } from 'src/app/utils';
import { AuthActionTypes } from './auth.actions';

@Injectable()
export class AuthEffects {
    /** Set access token to `localStorage` when `AuthActionTypes.SAVE` action is dispatched */
    public saveAccessToken = createEffect(
        () =>
            this.actions.pipe(
                ofType(AuthActionTypes.SAVE),
                tap<{ payload: LoginUserDTO }>((value) => {
                    if (Helpers.isString(value?.payload?.access_token)) {
                        localStorage.setItem(CONSTANTS.LS_ACCESS_TOKEN_KEY, value.payload.access_token);
                    }
                }),
            ),
        { dispatch: false },
    );

    /** Constructor */
    constructor(private actions: Actions) {}
}
