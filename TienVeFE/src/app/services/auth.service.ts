import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoginUserDTO, SaveAccountDTO, UserDTO } from '../dtos';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS } from '../utils';
import { HTTPOptions } from '../utils/http';
import { ValueOf } from '../utils/types';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public async loginOtp(id: number, otp: string, emailPhone: string, type: ValueOf<typeof CONSTANTS.LOGIN_TYPES>) {
        try {
            const opts = new HTTPOptions();
            opts.useAccessToken = false;

            const params = { id, otp, email_phone: emailPhone, type };
            const httpRes = await firstValueFrom(this._http.post(API_ROUTES.AUTH.LOGIN_OTP, params));
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
