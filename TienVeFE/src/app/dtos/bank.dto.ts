export class BankDTO {
    public id = 0;
    public brand_name = ' ';
    public name = ' ';
    public img_path = ' ';
    public is_deleted: 0 | 1 = 0;
    public created_date = ' ';
    public updated_date = ' ';

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new BankDTO();
        instance.id = Number(json['id']) || 0;
        instance.brand_name = String(json['brand_name'] || '');
        instance.name = String(json['name'] || '');
        instance.img_path = String(json['img_path'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => BankDTO.fromJson(item));
    }
}
