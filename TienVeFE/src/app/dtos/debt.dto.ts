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
