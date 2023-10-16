import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { RemindMessageDTO, RemindMessageSearchQuery } from '../dtos';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class RemindMessageService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public getList(params?: RemindMessageSearchQuery) {
        return this._http.get<ListResponse>(API_ROUTES.REMIND_MESSAGE.LIST, params).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<RemindMessageDTO>());

                const list = RemindMessageDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse<RemindMessageDTO>(list, httpRes.body?.data.total);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<RemindMessageDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<RemindMessageDTO>()));
            }),
        );
    }

    public async getDetail(id: number) {
        try {
            const route = API_ROUTES.REMIND_MESSAGE.DETAIL.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.get(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = RemindMessageDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async deleteMultiple(idList: number[]) {
        try {
            const route = API_ROUTES.REMIND_MESSAGE.DELETE_MULTIPLE;
            const httpRes = await firstValueFrom(this._http.delete<RemindMessageDTO[]>(route, { id_list: idList }));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

            const item = RemindMessageDTO.fromList(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, [], err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);
        }
    }
}
