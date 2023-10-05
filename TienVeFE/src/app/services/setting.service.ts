import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { SettingDTO } from '../dtos';
import { APIResponse, API_ROUTES, BaseHTTPClient, CONSTANTS, ListResponse } from '../utils';
import { ValueOf } from '../utils/types';

@Injectable({
    providedIn: 'root',
})
export class SettingService {
    /** Constructor */
    constructor(private _http: BaseHTTPClient) {}

    public getListByFieldNameList(fieldNameList: ValueOf<typeof CONSTANTS.SETTING_FIELD_NAMES>[]) {
        return this._http.get<ListResponse>(API_ROUTES.SETTING.GET_LIST_BY_FIELD_NAME_LIST, { field_name_list: fieldNameList }).pipe(
            map((httpRes) => {
                if (!httpRes.body?.data) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<SettingDTO>());

                const list = SettingDTO.fromList(httpRes.body?.data.list);
                const result = new ListResponse(list, list.length);
                return APIResponse.success(httpRes.body.message, result);
            }),
            catchError((err) => {
                if (APIResponse.is(err)) {
                    return of(APIResponse.error(err.message, new ListResponse<SettingDTO>()));
                }
                return of(APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR, new ListResponse<SettingDTO>()));
            }),
        );
    }

    public async updateMultiple(params: { [fieldName: string]: string }): Promise<APIResponse<void>> {
        try {
            const httpRes = await firstValueFrom(this._http.put<void>(API_ROUTES.SETTING.UPDATE_MULTIPLE, params));
            if (!httpRes.body) return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);

            return APIResponse.success(httpRes.body.message);
        } catch (err) {
            if (APIResponse.is(err)) {
                return APIResponse.error(err.message);
            }
            return APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR);
        }
    }
}
