import { Helpers } from '../utils';
import { CommonSearchQuery } from '../utils/types';

export class MessageDTO {
    public id = 0;
    public address = '';
    public phone = '';
    public body = '';
    public send_date = '';
    public receive_date = '';
    public debt_id?: string;
    public amount = 0;
    public is_deleted: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new MessageDTO();
        instance.id = Number(json['id']) || 0;
        instance.address = String(json['address'] || '');
        instance.phone = String(json['phone'] || '');
        instance.body = String(json['body'] || '');
        instance.send_date = String(json['send_date'] || '');
        instance.receive_date = String(json['receive_date'] || '');
        if (Helpers.isString(json['debt_id'])) {
            instance.debt_id = json['debt_id'];
        }
        instance.amount = Number(json['amount']) || 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: unknown }[]) {
        return jsonList.map((item) => MessageDTO.fromJson(item));
    }
}

export type MessageSearchQuery = CommonSearchQuery & {
    debt_id?: string;
    receive_user_id?: number;
};
