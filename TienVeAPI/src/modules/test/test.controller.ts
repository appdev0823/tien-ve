import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from 'src/includes';
import { APIResponse, MESSAGES } from 'src/utils';
import ROUTES from '../routes';
import { TestService } from './test.service';

@Controller(ROUTES.TEST.MODULE)
export class TestController extends BaseController {
    private TEST_CASES = {
        EXTRACT_SMS: 'EXTRACT_SMS',
    } as const;
    /** Constructor */
    constructor(private readonly _testService: TestService) {
        super();
    }

    @Get(ROUTES.TEST.INDEX)
    public async index(@Res() res: Response<APIResponse<void>>, @Query() query: { [key: string]: string }) {
        try {
            const testCase = query.test_case;
            let isSuccess = false;

            switch (testCase) {
            case this.TEST_CASES.EXTRACT_SMS:
                isSuccess = await this._testService.test_MessageService_extractSMS();
                break;
            default:
                break;
            }

            if (!isSuccess) {
                const errRes = APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
            }

            const successRes = APIResponse.success<void>(MESSAGES.SUCCESS.SUCCESS);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.index.name, e);
            const errRes = APIResponse.error<void>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }
}
