import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { DebtDTO, DebtDetailDTO, DebtRemindRequest, DebtSearchQuery, RemindMessageDTO, SaveDebtDTO } from '../dtos';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class DebtService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public async createMultiple(dataList: SaveDebtDTO[]) {
        try {
            const httpRes = await firstValueFrom(this._http.post<ListResponse>(API_ROUTES.DEBT.CREATE_MULTIPLE, dataList));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<DebtDTO>());

            const list = DebtDTO.fromList(httpRes.body?.data.list);
            const result = new ListResponse(list, list.length);
            return APIResponse.success(httpRes.body.message, result);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, new ListResponse<DebtDTO>());
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<DebtDTO>());
        }
    }

    public getList(queries?: DebtSearchQuery) {
        return this._http.get<ListResponse>(API_ROUTES.DEBT.LIST, queries).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<DebtDTO>());

                const list = DebtDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse(list, httpRes.body?.data.total);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<DebtDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<DebtDTO>()));
            }),
        );
    }

    public async getDetail(id: string) {
        try {
            const route = API_ROUTES.DEBT.DETAIL.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.get(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = DebtDetailDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async deleteMultiple(idList: string[]) {
        try {
            const route = API_ROUTES.DEBT.DELETE_MULTIPLE;
            const httpRes = await firstValueFrom(this._http.delete<DebtDTO[]>(route, { id_list: idList }));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

            const item = DebtDTO.fromList(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, [], err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);
        }
    }

    public async remind(params: DebtRemindRequest) {
        try {
            const httpRes = await firstValueFrom(this._http.post<RemindMessageDTO[]>(API_ROUTES.DEBT.REMIND, params));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

            const result = DebtDTO.fromList(httpRes.body?.data);
            return APIResponse.success(httpRes.body.message, result);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, []);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);
        }
    }
}
