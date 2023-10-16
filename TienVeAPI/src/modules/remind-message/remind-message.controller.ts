import { Controller, Delete, Get, HttpStatus, Param, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { RemindMessageDTO, RemindMessageSearchQuery } from 'src/dtos';
import { BaseController } from 'src/includes';
import { APIListResponse, APIResponse, Helpers, MESSAGES } from 'src/utils';
import { AuthenticatedRequest, IdListObject } from 'src/utils/types';
import ROUTES from '../routes';
import { RemindMessageService } from './remind-message.service';

@Controller(ROUTES.REMIND_MESSAGE.MODULE)
export class RemindMessageController extends BaseController {
    /** Constructor */
    constructor(private readonly _remindMessageService: RemindMessageService) {
        super();
    }

    @Get(ROUTES.REMIND_MESSAGE.LIST)
    public async getList(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response<APIListResponse<RemindMessageDTO>>,
        @Query() query: RemindMessageSearchQuery,
    ) {
        try {
            const total = await this._remindMessageService.getTotal(query, req.userPayload.id);
            let list: RemindMessageDTO[] = [];
            if (total > 0) {
                list = await this._remindMessageService.getList(query, req.userPayload.id);
                if (!Helpers.isFilledArray(list)) {
                    const errRes = APIListResponse.error<RemindMessageDTO>(MESSAGES.ERROR.ERR_NO_DATA);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
                }
            }

            const successRes = APIListResponse.success<RemindMessageDTO>(MESSAGES.SUCCESS.SUCCESS, list, total);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.getList.name, e);
            const errRes = APIListResponse.error<RemindMessageDTO>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }

    @Delete(ROUTES.REMIND_MESSAGE.DELETE_MULTIPLE)
    public async deleteMultiple(@Query() query: IdListObject<number>, @Res() res: Response<APIResponse<RemindMessageDTO[]>>) {
        try {
            const idList = query.id_list;
            const result = await this._remindMessageService.deleteMultiple(idList);
            if (!Helpers.isFilledArray(result)) {
                const errRes = APIResponse.error<RemindMessageDTO[]>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR, []);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
            }

            const successRes = APIResponse.success(MESSAGES.SUCCESS.SUCCESS, result);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.deleteMultiple.name, e);
            const errRes = APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR, []);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }

    @Get(ROUTES.REMIND_MESSAGE.DETAIL)
    public async getDetail(@Param('id') id: number, @Res() res: Response<APIResponse<RemindMessageDTO | undefined>>) {
        try {
            const item = await this._remindMessageService.getDetail(id);
            if (!item) {
                const errRes = APIResponse.error(MESSAGES.ERROR.ERR_NOT_FOUND);
                return res.status(HttpStatus.BAD_REQUEST).json(errRes);
            }

            const successRes = APIResponse.success(MESSAGES.SUCCESS.SUCCESS, item);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.getDetail.name, e);
            const errRes = APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }
}
