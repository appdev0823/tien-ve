import { Injectable } from '@nestjs/common';
import { BankDTO, MessageAmountStatsDTO, MessageDTO, MessageDetailDTO, MessageListDTO, MessageSearchQuery } from 'src/dtos';
import { MessageEntity } from 'src/entities';
import { BaseService } from 'src/includes';
import { BankAccountRepository, MessageRepository } from 'src/repository';
import { CONSTANTS, Helpers, mapper } from 'src/utils';
import { ExtractedSMSInfo } from 'src/utils/types';
import { DataSource, In } from 'typeorm';
import { MessageStatsQuery } from './../../dtos';

@Injectable()
export class MessageService extends BaseService {
    /** Constructor */
    constructor(
        private readonly _messageRepo: MessageRepository,
        private readonly _bankAccountRepo: BankAccountRepository,
        private readonly _dataSource: DataSource,
    ) {
        super();
    }

    public async create(message: MessageDTO) {
        if (Helpers.isEmptyObject(message)) return null;

        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const messageEntity = new MessageEntity();
            messageEntity.user_id = message.user_id;
            messageEntity.address = message.address;
            messageEntity.phone = message.phone;
            messageEntity.body = message.body;
            messageEntity.send_date = message.send_date;
            messageEntity.receive_date = message.receive_date;
            messageEntity.amount = message.amount;
            messageEntity.balance = message.balance;
            messageEntity.sign = message.sign;
            messageEntity.bank_account_id = message.bank_account_id;
            messageEntity.debt_id = message.debt_id ?? null;

            await this._messageRepo.save(messageEntity);

            if (message.bank_account_id) {
                const bankAccEntity = await this._bankAccountRepo.findOneBy({ id: message.bank_account_id });
                if (!bankAccEntity) {
                    await queryRunner.rollbackTransaction();
                    return null;
                }

                bankAccEntity.last_message_id = messageEntity.id;
                if (Number(bankAccEntity.status) === CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED) {
                    bankAccEntity.status = CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED;
                }

                await this._bankAccountRepo.save(bankAccEntity);
            }

            await queryRunner.commitTransaction();

            return mapper.map(messageEntity, MessageEntity, MessageDTO);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }

    public async getList(params: MessageSearchQuery) {
        const query = this._messageRepo
            .createQueryBuilder('message')
            .select('message.*')
            .addSelect('bank_account.account_number as bank_account_number')
            .addSelect('bank.brand_name as bank_brand_name')
            .addSelect('DATE_FORMAT(message.send_date, \'%d/%m/%Y %H:%i:%s\') as send_date')
            .addSelect('DATE_FORMAT(message.receive_date, \'%d/%m/%Y %H:%i:%s\') as receive_date')
            .addSelect('DATE_FORMAT(message.created_date, \'%d/%m/%Y %H:%i:%s\') as created_date')
            .leftJoin('d_bank_accounts', 'bank_account', 'bank_account.id = message.bank_account_id')
            .leftJoin('m_banks', 'bank', 'bank_account.bank_id = bank.id')
            .where('message.is_deleted = 0')
            .groupBy('message.id')
            .orderBy('message.send_date', 'DESC');

        if (Helpers.isString(params.debt_id)) {
            query.andWhere('message.debt_id = :debt_id', { debt_id: params.debt_id });
        }

        if (params.user_id) {
            query.andWhere('message.user_id = :user_id', { user_id: params.user_id });
        }

        if (Helpers.isString(params.keyword)) {
            query.andWhere(
                `(
                message.address LIKE :keyword OR
                message.phone LIKE :keyword OR
                message.body LIKE :keyword OR
                message.debt_id LIKE :keyword
            )`,
                { keyword: `%${params.keyword}%` },
            );
        }

        if (Helpers.isString(params.start_date)) {
            query.andWhere('message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` });
        }

        if (Helpers.isString(params.end_date)) {
            query.andWhere('message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` });
        }

        if (params.bank_account_id) {
            query.andWhere('message.bank_account_id = :bank_account_id', { bank_account_id: params.bank_account_id });
        }

        if (params.bank_account_number) {
            query.andWhere('bank_account.account_number = :bank_account_number', { bank_account_number: params.bank_account_number });
        }

        if (Number(params?.page) > 0) {
            const page = Number(params?.page);
            const offset = (page - 1) * CONSTANTS.PAGE_SIZE;
            query.offset(offset).limit(CONSTANTS.PAGE_SIZE);
        }

        const result = await query.getRawMany<MessageListDTO>();
        return Helpers.isFilledArray(result) ? result : [];
    }

    public async getTotal(params: MessageSearchQuery) {
        const query = this._messageRepo.createQueryBuilder('message').where('message.is_deleted = 0');

        if (Helpers.isString(params.debt_id)) {
            query.andWhere('message.debt_id = :debt_id', { debt_id: params.debt_id });
        }

        if (params.user_id) {
            query.andWhere('message.user_id = :user_id', { user_id: params.user_id });
        }

        if (Helpers.isString(params.keyword)) {
            query.andWhere(
                `(
                message.address LIKE :keyword OR
                message.phone LIKE :keyword OR
                message.body LIKE :keyword OR
                message.debt_id LIKE :keyword
            )`,
                { keyword: `%${params.keyword}%` },
            );
        }

        if (Helpers.isString(params.start_date)) {
            query.andWhere('message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` });
        }

        if (Helpers.isString(params.end_date)) {
            query.andWhere('message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` });
        }

        if (params.bank_account_id) {
            query.andWhere('message.bank_account_id = :bank_account_id', { bank_account_id: params.bank_account_id });
        }

        return query.getCount();
    }

    public async getDetail(id: number) {
        const query = this._messageRepo
            .createQueryBuilder('message')
            .select('message.*')
            .addSelect('bank_account.account_number as bank_account_number')
            .addSelect('bank.brand_name as bank_brand_name')
            .addSelect('DATE_FORMAT(message.send_date, \'%d/%m/%Y %H:%i:%s\') as send_date')
            .addSelect('DATE_FORMAT(message.created_date, \'%d/%m/%Y %H:%i:%s\') as created_date')
            .leftJoin('d_bank_accounts', 'bank_account', 'bank_account.id = message.bank_account_id')
            .leftJoin('m_banks', 'bank', 'bank_account.bank_id = bank.id')
            .where('message.id = :id', { id });

        return await query.getRawOne<MessageDetailDTO>();
    }

    public async updateDebtId(id: number, debtId?: string) {
        if (!id) return null;

        const item = await this._messageRepo.findOneBy({ id });
        if (!item) return null;

        item.debt_id = Helpers.isString(debtId) ? debtId : null;

        await this._messageRepo.save(item);

        return mapper.map(item, MessageEntity, MessageDTO);
    }

    public async getAmountMonthlyStats(params: MessageStatsQuery, userId: number) {
        if (!userId || !Helpers.isString(params.start_date) || !Helpers.isString(params.end_date)) return [];

        const monthList = Helpers.getDateListInRange(params.start_date, params.end_date, 'MM/YYYY', 'month');
        // if (!Helpers.isFilledArray(monthList)) return [];

        const query = this._messageRepo
            .createQueryBuilder('message')
            .select('DATE_FORMAT(message.created_date, \'%m/%Y\') as time')
            .addSelect('IFNULL(SUM(message.amount * message.sign), 0) as total_amount')
            .where('message.is_deleted = 0')
            .andWhere('message.user_id = :user_id', { user_id: userId })
            .andWhere('message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` })
            .andWhere('message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` })
            .groupBy('DATE_FORMAT(message.created_date, \'%m/%Y\')')
            .orderBy('time', 'DESC');

        const result = await query.getRawMany<MessageAmountStatsDTO>();
        if (!Helpers.isFilledArray(result)) return [];

        return monthList.map((month) => {
            const found = result.find((stats) => stats.time === month);

            const item = new MessageAmountStatsDTO();
            item.time = month;
            item.total_amount = Number(found?.total_amount) || 0;

            return item;
        });
    }

    public async getAmountDailyStats(params: MessageStatsQuery, userId: number) {
        if (!userId || !Helpers.isString(params.start_date) || !Helpers.isString(params.end_date)) return [];

        const dayList = Helpers.getDateListInRange(params.start_date, params.end_date, 'DD/MM/YYYY', 'day');
        if (!Helpers.isFilledArray(dayList)) return [];

        const query = this._messageRepo
            .createQueryBuilder('message')
            .select('DATE_FORMAT(message.created_date, \'%d/%m/%Y\') as time')
            .addSelect('IFNULL(SUM(message.amount * message.sign), 0) as total_amount')
            .where('message.is_deleted = 0')
            .andWhere('message.user_id = :user_id', { user_id: userId })
            .andWhere('message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` })
            .andWhere('message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` })
            .groupBy('DATE_FORMAT(message.created_date, \'%d/%m/%Y\')')
            .orderBy('time', 'DESC');

        const result = await query.getRawMany<MessageAmountStatsDTO>();
        // if (!Helpers.isFilledArray(result)) return [];

        return dayList.map((day) => {
            const found = result.find((stats) => stats.time === day);

            const item = new MessageAmountStatsDTO();
            item.time = day;
            item.total_amount = Number(found?.total_amount) || 0;

            return item;
        });
    }

    public async deleteMultiple(idList: number[]) {
        if (!Helpers.isFilledArray(idList)) return [];

        const itemList = await this._messageRepo.findBy({ id: In(idList) });
        if (!Helpers.isFilledArray(idList)) return [];

        itemList.forEach((item) => (item.is_deleted = 1));

        await this._messageRepo.save(itemList);

        return itemList.map((item) => mapper.map(item, MessageEntity, MessageDTO));
    }

    /**
     * Extract information from SMS body
     * @param body - SMS body
     * @param bank - Bank data with master extract data
     * @returns Extracted information, `null` if error
     */
    public extractSMS(body: string, bank: BankDTO): ExtractedSMSInfo | null {
        if (!Helpers.isString(body)) return null;

        let result: ExtractedSMSInfo | null = null;
        if (bank.use_extract_sms_template && Helpers.isString(bank.extract_sms_template)) {
            // extract using template
            result = Helpers.extractStringWithTemplate<ExtractedSMSInfo>(bank.extract_sms_template, body);
            if (!result) return null;
        } else {
            // extract using extraction data (when not having template)
            let accountNumber = Helpers.getSubstringBetweenStartEnd(body, bank.account_number_start, ' ');
            if (accountNumber?.includes('\n')) {
                accountNumber = Helpers.getSubstringBetweenStartEnd(body, bank.account_number_start, '\n');
            }

            let amountStr = Helpers.getSubstringBetweenStartEnd(body, '+', 'VND');
            if (!Helpers.isString(amountStr)) {
                amountStr = Helpers.getSubstringBetweenStartEnd(body, '-', 'VND');
            }

            const balanceStr = Helpers.getSubstringBetweenStartEnd(body, bank.balance_start, 'VND');

            result = {
                account_number: accountNumber || '',
                amount: amountStr || '',
                balance: balanceStr || '',
                debt_id: '',
            };
        }

        const debtIdStart = `${CONSTANTS.DEBT_ID_FORMAT.PREFIX}${CONSTANTS.DEBT_ID_FORMAT.SEPARATOR}`;
        const debtId = Helpers.getSubstringFromStart(body, debtIdStart, CONSTANTS.DEBT_ID_FORMAT.LENGTH);
        result.debt_id = Helpers.isString(debtId) ? debtId : '';

        return result;
    }
}
