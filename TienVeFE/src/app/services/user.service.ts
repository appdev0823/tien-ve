import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS } from '../utils';
import { UserDTO } from '../dtos';

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
}
