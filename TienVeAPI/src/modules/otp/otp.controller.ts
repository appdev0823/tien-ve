import { Body, Controller, HttpStatus, Post, Res, UsePipes } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { CreateOtpDTO, OtpDTO } from 'src/dtos';
import { BaseController } from 'src/includes';
import { ValidationPipe } from 'src/pipes';
import { APIResponse, CONSTANTS, Helpers, MESSAGES } from 'src/utils';
import ROUTES from '../routes';
import * as OtpSchemas from './otp.schemas';
import { OtpService } from './otp.service';

@Controller(ROUTES.OTP.MODULE)
export class OtpController extends BaseController {
    /** Constructor */
    constructor(private readonly _otpService: OtpService) {
        super();
    }

    @Post(ROUTES.OTP.CREATE)
    @UsePipes(new ValidationPipe(OtpSchemas.createSchema))
    public async create(@Res() res: Response<APIResponse<OtpDTO | undefined>>, @Body() body: CreateOtpDTO) {
        try {
            const otp = new OtpDTO();
            otp.otp = Helpers.generateOTP();
            otp.receive_address = body.receive_address || '';
            otp.type = body.type;
            otp.expired_date = dayjs().add(CONSTANTS.OTP.EXPIRED_SECONDS, 'seconds').format(CONSTANTS.MYSQL_DATETIME_FORMAT);
            otp.is_used = 0;

            const result = await this._otpService.create(otp);
            if (!result || Helpers.isEmptyObject(result)) {
                const errRes = APIResponse.error<undefined>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
            }

            result.otp = '';
            const successRes = APIResponse.success<OtpDTO | undefined>(MESSAGES.SUCCESS.SUCCESS, result);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.create.name, e);
            const errRes = APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }
}
