import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { MessageAmountStatsDTO, MessageDTO, MessageSearchQuery, MessageStatsQuery } from '../dtos';
import { API_ROUTES, APIResponse, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public getList(params?: MessageSearchQuery) {
        return this._http.get<ListResponse>(API_ROUTES.MESSAGE.LIST, params).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<MessageDTO>());

                const list = MessageDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse<MessageDTO>(list, httpRes.body?.data.total);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<MessageDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<MessageDTO>()));
            }),
        );
    }

    public async updateDebtId(id: number, debtId?: string) {
        try {
            const route = API_ROUTES.MESSAGE.UPDATE_DEBT_ID.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.put(route, { debt_id: debtId }));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = MessageDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public getAmountMonthlyStats(params?: MessageStatsQuery) {
        return this._http.get<any[]>(API_ROUTES.MESSAGE.AMOUNT_MONTHLY_STATS, params).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

                const result = MessageAmountStatsDTO.fromList(httpRes.body?.data);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, []));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []));
            }),
        );
    }

    public getAmountDailyStats(params?: MessageStatsQuery) {
        return this._http.get<any[]>(API_ROUTES.MESSAGE.AMOUNT_DAILY_STATS, params).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

                const result = MessageAmountStatsDTO.fromList(httpRes.body?.data);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, []));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []));
            }),
        );
    }

    public async getDetail(id: number) {
        try {
            const route = API_ROUTES.MESSAGE.DETAIL.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.get(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = MessageDTO.fromJson(httpRes.body.data);
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
            const route = API_ROUTES.MESSAGE.DELETE_MULTIPLE;
            const httpRes = await firstValueFrom(this._http.delete<MessageDTO[]>(route, { id_list: idList }));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

            const item = MessageDTO.fromList(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, [], err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);
        }
    }
}
