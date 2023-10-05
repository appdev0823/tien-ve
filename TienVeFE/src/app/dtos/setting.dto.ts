import { CONSTANTS } from '../utils';
import { ValueOf } from '../utils/types';

export class SettingDTO {
    public id = 0;
    public field_name: ValueOf<typeof CONSTANTS.SETTING_FIELD_NAMES> = CONSTANTS.SETTING_FIELD_NAMES.UPGRADE_NOTE;
    public value = '';
    public note = '';
    public is_deleted: 0 | 1 = 0;
    public created_date = ' ';
    public updated_date = ' ';

    static fromJson(json: { [key: string]: unknown }) {
        const instance = new SettingDTO();
        instance.id = Number(json['id']) || 0;
        instance.field_name = String(json['field_name'] || '') as ValueOf<typeof CONSTANTS.SETTING_FIELD_NAMES>;
        instance.value = String(json['value'] || '');
        instance.note = String(json['note'] || '');
        instance.is_deleted = json['is_deleted'] ? 1 : 0;
        instance.created_date = String(json['created_date'] || '');
        instance.updated_date = String(json['updated_date'] || '');
        return instance;
    }

    static fromList(jsonList: { [key: string]: any }[]) {
        return jsonList.map((item) => SettingDTO.fromJson(item));
    }
}
