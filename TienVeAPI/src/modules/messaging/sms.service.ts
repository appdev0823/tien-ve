import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SMSService {
    constructor(private readonly _httpService: HttpService, private readonly _configService: ConfigService) {}

    async sendOTP(phone: string, otp: string) {
        const esmsUrl = String(this._configService.get('ESMS_URL'));
        const esmsApiKey = String(this._configService.get('ESMS_API_KEY'));
        const esmsSecretKey = String(this._configService.get('ESMS_SECRET_KEY'));
        const esmsSandBox = this._configService.get('ESMS_SAND_BOX') ? 1 : 0;

        const simpleSMSType = '8';
        const params = {
            ApiKey: esmsApiKey,
            Content: `Mã xác nhận của bạn là ${otp}`,
            Phone: phone,
            SecretKey: esmsSecretKey,
            SmsType: simpleSMSType,
            SandBox: esmsSandBox,
        };

        const result = await firstValueFrom(
            this._httpService.post<{
                CodeResult: string;
                CountRegenerate: number;
                SMSID: string;
            }>(esmsUrl, params, { headers: { 'Content-Type': 'application/json' } }),
        );

        return String(result.data?.CodeResult) === '100';
    }
}
