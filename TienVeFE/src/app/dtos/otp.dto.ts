import { CONSTANTS } from '../utils';
import { ValueOf } from '../utils/types';

export class OtpDTO {
    public id = 0;
    public otp = '';
    public receive_address = '';
    public type: ValueOf<typeof CONSTANTS.REGISTER_TYPES> = CONSTANTS.REGISTER_TYPES.EMAIL;
    public expired_date = '';
    public is_used: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';

    constructor(params?: Partial<OtpDTO>) {
        this.id = params?.id || 0;
        this.otp = String(params?.otp);
        this.receive_address = String(params?.receive_address);
        this.type = params?.type || CONSTANTS.REGISTER_TYPES.EMAIL;
        this.expired_date = String(params?.expired_date);
        this.is_used = params?.is_used ? 1 : 0;
        this.created_date = String(params?.created_date);
        this.updated_date = String(params?.updated_date);
    }

    static fromJson(json?: { [key: string]: any }) {
        return new OtpDTO({
            id: Number(json?.['id']),
            otp: String(json?.['otp']),
            receive_address: String(json?.['receive_address']),
            type: json?.['type'] || CONSTANTS.REGISTER_TYPES.EMAIL,
            expired_date: String(json?.['expired_date']),
            is_used: json?.['is_used'] ? 1 : 0,
            created_date: String(json?.['created_date']),
            updated_date: String(json?.['updated_date']),
        });
    }
}
