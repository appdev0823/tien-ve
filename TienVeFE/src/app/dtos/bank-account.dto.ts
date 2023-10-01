export class BankAccountDTO {
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
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');

        instance.bank_brand_name = String(json['bank_brand_name'] || '');
        instance.bank_name = String(json['bank_name'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => BankAccountDTO.fromJson(item));
    }
}

export class SaveBankAccountDTO {
    id?: number;
    bank_id = 0;
    phone = '';
    branch_name = '';
    card_owner = '';
    account_number = '';
    name?: string;
}
