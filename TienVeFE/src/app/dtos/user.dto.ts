export class UserDTO {
    public id = 0;
    public email = '';
    public phone = '';
    public password = '';
    public name = '';
    public is_active: 0 | 1 = 1;
    public created_date = '';
    public updated_date = '';

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new UserDTO();
        instance.id = Number(json['id']) || 0;
        instance.email = String(json['email'] || '');
        instance.phone = String(json['phone'] || '');
        instance.name = String(json['name'] || '');
        instance.password = String(json['password'] || '');
        instance.is_active = json['is_active'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: unknown }[]) {
        return jsonList.map((item) => UserDTO.fromJson(item));
    }
}

export class LoginUserDTO extends UserDTO {
    public access_token = '';

    static override fromJson(json: { [key: string]: unknown }) {
        const parent = super.fromJson(json);
        const instance = new LoginUserDTO();
        instance.id = parent.id;
        instance.email = parent.email;
        instance.phone = parent.phone;
        instance.name = parent.name;
        instance.password = parent.password;
        instance.is_active = parent.is_active;
        instance.created_date = parent.created_date;
        instance.updated_date = parent.updated_date;
        instance.access_token = String(json['access_token'] || '');
        return instance;
    }
}

export class SaveAccountDTO {
    public email = '';
    public phone = '';
    public name = '';
    public password = '';
}
