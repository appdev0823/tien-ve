import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { BankDTO } from '../dtos';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class BankService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public getList() {
        return this._http.get<ListResponse>(API_ROUTES.BANK.LIST).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<BankDTO>());

                const list = BankDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse<BankDTO>(list, httpRes.body?.data.total);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<BankDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<BankDTO>()));
            }),
        );
    }
}
