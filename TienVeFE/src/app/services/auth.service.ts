import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { LoginUserDTO, SaveAccountDTO, UserDTO } from '../dtos';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS } from '../utils';
import { HTTPOptions } from '../utils/http';
import { ValueOf } from '../utils/types';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    /**
     * Login user
     * @param emailPhone - username
     * @param password - password
     * @returns user payload (no password) with access token
     */
    public login(emailPhone: string, password: string): Observable<APIResponse<LoginUserDTO | undefined>> {
        const opts = new HTTPOptions();
        opts.useAccessToken = false;
        return this._http.post(API_ROUTES.AUTH.LOGIN, { email_phone: emailPhone, password }, opts).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);

                const item = LoginUserDTO.fromJson(httpRes.body.data);
                return APIResponse.success(httpRes.body.message, item);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, undefined, err.errors));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR));
            }),
        );
    }

    public changePassword(oldPassword: string, newPassword: string): Observable<APIResponse<void>> {
        const params = {
            old_password: oldPassword,
            new_password: newPassword,
        };

        return this._http.post<void>(API_ROUTES.AUTH.CHANGE_PASSWORD, params).pipe(
            map((httpRes) => {
                if (!httpRes.body) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
                return APIResponse.success<void>(httpRes.body.message);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR));
            }),
        );
    }

    public async register(id: number, otp: string, emailPhone: string, type: ValueOf<typeof CONSTANTS.REGISTER_TYPES>) {
        try {
            const opts = new HTTPOptions();
            opts.useAccessToken = false;

            const params = { id, otp, email_phone: emailPhone, type };
            const httpRes = await firstValueFrom(this._http.post(API_ROUTES.AUTH.REGISTER, params));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);

            const item = LoginUserDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, undefined, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
        }
    }

    public async saveAccount(data: SaveAccountDTO) {
        try {
            const httpRes = await firstValueFrom(this._http.post(API_ROUTES.AUTH.SAVE_ACCOUNT, data));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);

            const item = UserDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, undefined, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
        }
    }
}
