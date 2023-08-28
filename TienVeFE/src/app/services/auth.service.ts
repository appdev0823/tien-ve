import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS } from '../utils';
import { HTTPOptions } from '../utils/http';
import { LoginUserDTO } from '../dtos';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    /**
     * Login user
     * @param username - username
     * @param password - password
     * @returns user payload (no password) with access token
     */
    public login(username: string, password: string): Observable<APIResponse<LoginUserDTO | undefined>> {
        const opts = new HTTPOptions();
        opts.useAccessToken = false;
        return this._http.post<LoginUserDTO | undefined>(API_ROUTES.AUTH.LOGIN, { username, password }, opts).pipe(
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
}
