import { AutoMap } from '@automapper/classes';
import { CommonSearchQuery } from 'src/utils/types';

export class MessageDTO {
    @AutoMap() id: number;
    @AutoMap() user_id: number;
    @AutoMap() address: string;
    @AutoMap() phone: string;
    @AutoMap() body: string;
    @AutoMap() send_date: string;
    @AutoMap() receive_date: string;
    @AutoMap() debt_id?: string;
    @AutoMap() amount: number;
    @AutoMap() balance: number;
    @AutoMap() sign: -1 | 1;
    @AutoMap() bank_account_id: number;
    @AutoMap() is_deleted: 0 | 1;
    @AutoMap() created_date: string;
    @AutoMap() updated_date: string;
}

export class CreateMessageDTO {
    address: string;
    phone: string;
    body: string;
    send_date: number;
    receive_date: number;
}

export type MessageSearchQuery = CommonSearchQuery & {
    debt_id?: string;
    bank_account_id?: number;
    bank_account_number?: string;
    user_id: number;
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
}

export class MessageListDTO extends MessageDTO {
    public bank_account_number = '';
    public bank_brand_name = '';
}

export class MessageDetailDTO extends MessageDTO {
    public bank_account_number = '';
    public bank_brand_name = '';
}
