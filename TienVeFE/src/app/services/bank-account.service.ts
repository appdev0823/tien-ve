import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { BankAccountDTO, BankAccountSearchQuery, SaveBankAccountDTO } from '../dtos';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';

@Injectable({
    providedIn: 'root',
})
export class BankAccountService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public getList(queries?: BankAccountSearchQuery) {
        return this._http.get<ListResponse>(API_ROUTES.BANK_ACCOUNT.LIST, queries).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<BankAccountDTO>());

                const list = BankAccountDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse<BankAccountDTO>(list, httpRes.body?.data.total);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<BankAccountDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<BankAccountDTO>()));
            }),
        );
    }

    public async getDetail(id: number) {
        try {
            const route = API_ROUTES.BANK_ACCOUNT.DETAIL.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.get(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = BankAccountDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async create(params: SaveBankAccountDTO) {
        try {
            const httpRes = await firstValueFrom(this._http.post(API_ROUTES.BANK_ACCOUNT.CREATE, params));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = BankAccountDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async update(params: SaveBankAccountDTO) {
        try {
            const route = API_ROUTES.BANK_ACCOUNT.UPDATE.replace(':id', String(params.id));
            const httpRes = await firstValueFrom(this._http.put(route, params));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = BankAccountDTO.fromJson(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, null, err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);
        }
    }

    public async delete(id: number) {
        try {
            const route = API_ROUTES.BANK_ACCOUNT.DELETE.replace(':id', String(id));
            const httpRes = await firstValueFrom(this._http.delete(route));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, null);

            const item = BankAccountDTO.fromJson(httpRes.body.data);
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
            const route = API_ROUTES.BANK_ACCOUNT.DELETE_MULTIPLE;
            const httpRes = await firstValueFrom(this._http.delete<BankAccountDTO[]>(route, { id_list: idList }));
            if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);

            const item = BankAccountDTO.fromList(httpRes.body.data);
            return APIResponse.success(httpRes.body.message, item);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message, [], err.errors);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, []);
        }
    }
}
