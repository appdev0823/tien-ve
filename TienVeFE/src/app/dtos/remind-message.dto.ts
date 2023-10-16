import { CONSTANTS } from '../utils';
import { CommonSearchQuery, ValueOf } from '../utils/types';
import { BaseDTO } from './base.dto';

export class RemindMessageDTO extends BaseDTO {
    public id = 0;
    public receiver_name = '';
    public phone = '';
    public body = '';
    public debt_id = '';
    public channel_type: ValueOf<typeof CONSTANTS.REMIND_MESSAGE.CHANNEL_TYPE> = CONSTANTS.REMIND_MESSAGE.CHANNEL_TYPE.SMS;
    public status: ValueOf<typeof CONSTANTS.REMIND_MESSAGE.STATUS> = CONSTANTS.REMIND_MESSAGE.STATUS.SENDING;
    public fail_reason = '';
    public is_deleted: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new RemindMessageDTO();
        instance.id = Number(json['id']) || 0;
        instance.receiver_name = String(json['receiver_name'] || '');
        instance.phone = String(json['phone'] || '');
        instance.body = String(json['body'] || '');
        instance.debt_id = String(json['debt_id'] || '');
        instance.channel_type = Number(json['channel_type']) as ValueOf<typeof CONSTANTS.REMIND_MESSAGE.CHANNEL_TYPE>;
        instance.status = Number(json['status']) as ValueOf<typeof CONSTANTS.REMIND_MESSAGE.STATUS>;
        instance.fail_reason = String(json['fail_reason'] || '');
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => RemindMessageDTO.fromJson(item));
    }
}

export type RemindMessageSearchQuery = CommonSearchQuery & {
    start_date?: string;
    end_date?: string;
};
