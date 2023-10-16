import { AutoMap } from '@automapper/classes';
import { CommonSearchQuery } from 'src/utils/types';

export class RemindMessageDTO {
    @AutoMap() id: number;
    @AutoMap() receiver_name: string;
    @AutoMap() phone: string;
    @AutoMap() body: string;
    @AutoMap() debt_id: string;
    @AutoMap() channel_type: number;
    @AutoMap() status: number;
    @AutoMap() fail_reason: string;
    @AutoMap() is_deleted: 0 | 1;
    @AutoMap() created_date: string;
    @AutoMap() updated_date: string;
}

export type RemindMessageSearchQuery = CommonSearchQuery & {
    start_date?: string;
    end_date?: string;
};
