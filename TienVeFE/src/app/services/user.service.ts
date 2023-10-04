import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS } from '../utils';
import { UserDTO } from '../dtos';
import { CountObject } from '../utils/types';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    /**
     * Get user profile
     */
    public getProfile(): Observable<APIResponse<UserDTO | undefined>> {
        return this._http.get<UserDTO | undefined>(API_ROUTES.USER.GET_PROFILE).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
                return APIResponse.success(httpRes.body.message, httpRes.body.data);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, undefined, err.errors));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR));
            }),
        );
    }

    public async getByEmailPhone(emailPhone: string) {
        try {
            const route = API_ROUTES.USER.GET_BY_EMAIL_PHONE.replace(':email_phone', String(emailPhone));
            const httpRes = await firstValueFrom(this._http.get(route));
            if (!httpRes.body) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
            if (!httpRes.body.data) return APIResponse.error(httpRes.body.message, null);

            const item = UserDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async getTodayDebtCount() {
        try {
            const route = API_ROUTES.USER.GET_TODAY_DEBT_COUNT;
            const httpRes = await firstValueFrom(this._http.get<CountObject>(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            return APIResponse.success(httpRes.body.message, httpRes.body?.data);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }
}
