import { Injectable } from '@angular/core';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS } from '../utils';
import { firstValueFrom } from 'rxjs';
import { ValueOf } from '../utils/types';
import { OtpDTO } from '../dtos';

@Injectable({
    providedIn: 'root',
})
export class OtpService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public async create(emailPhone: string, type: ValueOf<typeof CONSTANTS.LOGIN_TYPES>) {
        try {
            const params = { receive_address: emailPhone, type };
            const httpRes = await firstValueFrom(this._http.post(API_ROUTES.OTP.CREATE, params));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);

            const item = OtpDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, undefined, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
        }
    }
}
