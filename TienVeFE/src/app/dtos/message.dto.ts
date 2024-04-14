import { Helpers } from '../utils';
import { CommonSearchQuery } from '../utils/types';
import { BaseDTO } from './base.dto';

export class MessageDTO extends BaseDTO {
    public id = 0;
    public address = '';
    public phone = '';
    public body = '';
    public send_date = '';
    public receive_date = '';
    public sign: -1 | 1 = 1;
    public debt_id?: string;
    public amount = 0;
    public balance = 0;
    public is_deleted: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';

    public bank_account_number?: string;
    public bank_brand_name?: string;

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new MessageDTO();
        instance.id = Number(json['id']) || 0;
        instance.address = String(json['address'] || '');
        instance.phone = String(json['phone'] || '');
        instance.body = String(json['body'] || '');
        instance.send_date = String(json['send_date'] || '');
        instance.receive_date = String(json['receive_date'] || '');
        instance.sign = Number(json['sign']) > 0 ? 1 : -1;
        if (Helpers.isString(json['debt_id'])) {
            instance.debt_id = json['debt_id'];
        }
        instance.amount = Number(json['amount']) || 0;
        instance.balance = Number(json['balance']) || 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');

        if (Helpers.isString(json['bank_account_number'])) {
            instance.bank_account_number = String(json['bank_account_number'] || '');
        }
        if (Helpers.isString(json['bank_brand_name'])) {
            instance.bank_brand_name = String(json['bank_brand_name'] || '');
        }

        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => MessageDTO.fromJson(item));
    }
}

export type MessageSearchQuery = CommonSearchQuery & {
    debt_id?: string;
    bank_account_id?: number;
    bank_account_number?: string;
    receive_user_id?: number;
    start_date?: string;
    end_date?: string;
};

export type MessageStatsQuery = {
    start_date?: string;
    end_date?: string;
};

export class MessageAmountStatsDTO {
    public time = ' ';
    public total_amount = 0;

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new MessageAmountStatsDTO();
        instance.time = String(json['time'] || '');
        instance.total_amount = Number(json['total_amount']) || 0;
        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => MessageAmountStatsDTO.fromJson(item));
    }
}
