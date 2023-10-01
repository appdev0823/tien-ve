import { CONSTANTS } from '../utils';
import { CommonSearchQuery, ValueOf } from '../utils/types';
import { BaseDTO } from './base.dto';

export class BankAccountDTO extends BaseDTO {
    public id = 0;
    public bank_id = 0;
    public user_id = 0;
    public phone = '';
    public branch_name = '';
    public card_owner = '';
    public account_number = '';
    public name = '';
    public is_deleted: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';
    public status: ValueOf<typeof CONSTANTS.BANK_ACCOUNT_STATUSES> = CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED;
    public last_message_id?: number;

    public last_message_balance?: number;
    public last_message_sign?: -1 | 1;
    public bank_brand_name?: string;
    public bank_name?: string;

    public display_name?: string;

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new BankAccountDTO();
        instance.id = Number(json['id']) || 0;
        instance.bank_id = Number(json['bank_id']) || 0;
        instance.user_id = Number(json['user_id']) || 0;
        instance.phone = String(json['phone'] || '');
        instance.branch_name = String(json['branch_name'] || '');
        instance.card_owner = String(json['card_owner'] || '');
        instance.account_number = String(json['account_number'] || '');
        instance.name = String(json['name'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.status = json['status'] as ValueOf<typeof CONSTANTS.BANK_ACCOUNT_STATUSES>;
        instance.last_message_id = Number(json['last_message_id']) || 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');

        instance.bank_brand_name = String(json['bank_brand_name'] || '');
        instance.bank_name = String(json['bank_name'] || '');
        instance.last_message_balance = Number(json['last_message_balance']) || 0;
        if (json['last_message_sign']) {
            instance.last_message_sign = Number(json['last_message_sign']) === 1 ? 1 : -1;
        }

        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => BankAccountDTO.fromJson(item));
    }
}

export class SaveBankAccountDTO {
    public id?: number;
    public bank_id = 0;
    public phone = '';
    public branch_name = '';
    public card_owner = '';
    public account_number = '';
    public status: ValueOf<typeof CONSTANTS.BANK_ACCOUNT_STATUSES> = CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED;
    public name?: string;
}

export type BankAccountSearchQuery = CommonSearchQuery & {
    status?: ValueOf<typeof CONSTANTS.BANK_ACCOUNT_STATUSES>;
};
