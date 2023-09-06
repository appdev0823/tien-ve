import { CommonSearchQuery } from '../utils/types';

export class DebtDTO {
    public id = '';
    public user_id = 0;
    public bank_account_id = 0;
    public payer_name = '';
    public payer_phone = '';
    public amount = 0;
    public note = '';
    public is_deleted: 0 | 1 = 0;
    public created_date = '';
    public updated_date = '';

    public paid_amount?: number;
    public bank_account_number?: string;
    public bank_brand_name?: string;

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new DebtDTO();
        instance.id = String(json['id'] || '');
        instance.user_id = Number(json['user_id']) || 0;
        instance.bank_account_id = Number(json['bank_account_id']) || 0;
        instance.payer_name = String(json['payer_name'] || '');
        instance.payer_phone = String(json['payer_phone'] || '');
        instance.amount = Number(json['amount']) || 0;
        instance.note = String(json['note'] || '');
        instance.is_deleted = json['is_active'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');

        if (json['paid_amount']) {
            instance.paid_amount = Number(json['paid_amount']) || 0;
        }
        if (json['bank_account_number']) {
            instance.bank_account_number = String(json['bank_account_number'] || '');
        }
        if (json['bank_brand_name']) {
            instance.bank_brand_name = String(json['bank_brand_name'] || '');
        }

        return instance;
    }

    static fromList(jsonList: { [key: string]: unknown }[]) {
        return jsonList.map((item) => DebtDTO.fromJson(item));
    }
}

export class SaveDebtDTO {
    public bank_account_id = 0;
    public payer_name = '';
    public payer_phone = '';
    public amount = 0;
    public note = '';
}

export type DebtSearchQuery = CommonSearchQuery & {
    min_amount?: number;
    max_amount?: number;
    start_date?: string;
    end_date?: string;
    is_paid?: boolean;
    is_not_paid?: boolean;
};

export class DebtDetailDTO extends DebtDTO {
    public bank_account_bank_id = 0;
    public bank_account_user_id = 0;
    public bank_account_phone = '';
    public bank_account_branch_name = '';
    public bank_account_card_owner = '';
    public bank_account_name = '';

    static override fromJson(json: { [key: string]: unknown }) {
        const parent = super.fromJson(json);
        const instance = new DebtDetailDTO();
        instance.id = parent.id;
        instance.user_id = parent.user_id;
        instance.bank_account_id = parent.bank_account_id;
        instance.payer_name = parent.payer_name;
        instance.payer_phone = parent.payer_phone;
        instance.amount = parent.amount;
        instance.note = parent.note;
        instance.is_deleted = parent.is_deleted;
        instance.created_date = parent.created_date;
        instance.updated_date = parent.updated_date;
        instance.paid_amount = parent.paid_amount;
        instance.bank_account_number = parent.bank_account_number;
        instance.bank_brand_name = parent.bank_brand_name;

        instance.bank_account_bank_id = Number(json['bank_account_bank_id']) || 0;
        instance.bank_account_user_id = Number(json['bank_account_user_id']) || 0;
        instance.bank_account_phone = String(json['bank_account_phone'] || '');
        instance.bank_account_branch_name = String(json['bank_account_branch_name'] || '');
        instance.bank_account_card_owner = String(json['bank_account_card_owner'] || '');
        instance.bank_account_name = String(json['bank_account_name'] || '');
        return instance;
    }
}
