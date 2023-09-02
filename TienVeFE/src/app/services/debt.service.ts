import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DebtDTO, SaveDebtDTO } from '../dtos/debt.dto';
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
}
