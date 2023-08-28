export class UserDTO {
    public username = '';
    public password = '';
    public name = '';
    public is_active: 0 | 1 = 1;
    public created_date = '';
    public updated_date = '';

    constructor(params?: { username?: string; password?: string; name?: string; is_active?: 0 | 1; created_date?: string; updated_date?: string }) {
        this.username = params?.username || '';
        this.password = params?.password || '';
        this.name = params?.name || '';
        this.is_active = params?.is_active ? 1 : 0;
        this.created_date = params?.created_date || '';
        this.updated_date = params?.updated_date || '';
    }

    static fromJson(json?: { [key: string]: any }) {
        return new UserDTO({
            username: json?.['username'],
            password: json?.['password'],
            name: json?.['name'],
            is_active: json?.['is_active'],
            created_date: json?.['created_date'],
            updated_date: json?.['updated_date'],
        });
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => UserDTO.fromJson(item));
    }
}

export class LoginUserDTO extends UserDTO {
    public access_token = '';

    constructor(params?: { username?: string; password?: string; name?: string; is_active?: 0 | 1; created_date?: string; updated_date?: string; access_token?: string }) {
        super(params);
        this.access_token = params?.access_token || '';
    }

    static override fromJson(json: { [key: string]: any }) {
        return new LoginUserDTO(json);
    }
}
