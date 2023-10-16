import { Injectable } from '@nestjs/common';
import { RemindMessageDTO, RemindMessageSearchQuery } from 'src/dtos';
import { RemindMessageEntity } from 'src/entities';
import { BaseService } from 'src/includes';
import { DebtRepository, RemindMessageRepository, UserRepository } from 'src/repository';
import { CONSTANTS, Helpers, mapper } from 'src/utils';
import { DataSource, In } from 'typeorm';

@Injectable()
export class RemindMessageService extends BaseService {
    /** Constructor */
    constructor(
        private readonly _remindMessageRepo: RemindMessageRepository,
        private readonly _userRepo: UserRepository,
        private readonly _debtRepo: DebtRepository,
        private readonly _dataSource: DataSource,
    ) {
        super();
    }

    public async sendMultiple(list: RemindMessageDTO[], userId: number) {
        if (!Helpers.isFilledArray(list) || !userId) return [];

        const msgList = list.map((item) => mapper.map(item, RemindMessageDTO, RemindMessageEntity));
        if (!Helpers.isFilledArray(msgList)) return [];

        const debtIdList = msgList.map((msg) => msg.debt_id);
        const debtList = await this._debtRepo.findBy({ id: In(debtIdList) });
        if (!Helpers.isFilledArray(debtList) || debtList.length !== debtIdList.length) return [];

        const user = await this._userRepo.findOneBy({ id: userId });
        if (!user || Helpers.isEmptyObject(user)) return [];

        const queryRunner = this._dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await this._remindMessageRepo.save(msgList);

            user.remind_count += msgList.length;

            await this._userRepo.save(user);

            for (const debt of debtList) {
                debt.remind_count += 1;
            }

            await this._debtRepo.save(debtList);

            await queryRunner.commitTransaction();

            return result.map((item) => mapper.map(item, RemindMessageEntity, RemindMessageDTO));
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return [];
        } finally {
            await queryRunner.release();
        }
    }

    public async getList(params: RemindMessageSearchQuery, userId: number) {
        if (!userId) return [];

        const query = this._remindMessageRepo
            .createQueryBuilder('remind_message')
            .select('remind_message.*')
            .addSelect('DATE_FORMAT(remind_message.created_date, \'%d/%m/%Y %H:%i:%s\') as created_date')
            .innerJoin('d_debts', 'debt', 'debt.id = remind_message.debt_id AND debt.user_id = :user_id', {
                user_id: userId,
            })
            .where('remind_message.is_deleted = 0')
            .groupBy('remind_message.id')
            .orderBy('remind_message.id', 'DESC');

        if (Helpers.isString(params.keyword)) {
            query.andWhere(
                `(
                remind_message.receiver_name LIKE :keyword OR
                remind_message.phone LIKE :keyword OR
                remind_message.body LIKE :keyword OR
                remind_message.debt_id LIKE :keyword
            )`,
                { keyword: `%${params.keyword}%` },
            );
        }

        if (Helpers.isString(params.start_date)) {
            query.andWhere('remind_message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` });
        }

        if (Helpers.isString(params.end_date)) {
            query.andWhere('remind_message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` });
        }

        if (Number(params?.page) > 0) {
            const page = Number(params?.page);
            const offset = (page - 1) * CONSTANTS.PAGE_SIZE;
            query.offset(offset).limit(CONSTANTS.PAGE_SIZE);
        }

        const result = await query.getRawMany<RemindMessageDTO>();
        return Helpers.isFilledArray(result) ? result : [];
    }

    public async getTotal(params: RemindMessageSearchQuery, userId: number) {
        if (!userId) return 0;

        const query = this._remindMessageRepo.createQueryBuilder('remind_message').where('remind_message.is_deleted = 0');

        if (Helpers.isString(params.keyword)) {
            query.andWhere(
                `(
                remind_message.receiver_name LIKE :keyword OR
                remind_message.phone LIKE :keyword OR
                remind_message.body LIKE :keyword OR
                remind_message.debt_id LIKE :keyword
            )`,
                { keyword: `%${params.keyword}%` },
            );
        }

        if (Helpers.isString(params.start_date)) {
            query.andWhere('remind_message.created_date >= :start_date', { start_date: `${params.start_date} 00:00:00` });
        }

        if (Helpers.isString(params.end_date)) {
            query.andWhere('remind_message.created_date <= :end_date', { end_date: `${params.end_date} 23:59:59` });
        }

        return query.getCount();
    }

    public async getDetail(id: number) {
        const query = this._remindMessageRepo
            .createQueryBuilder('remind_message')
            .select('remind_message.*')
            .addSelect('DATE_FORMAT(remind_message.created_date, \'%d/%m/%Y %H:%i:%s\') as created_date')
            .where('remind_message.id = :id', { id });

        return await query.getRawOne<RemindMessageDTO>();
    }

    public async deleteMultiple(idList: number[]) {
        if (!Helpers.isFilledArray(idList)) return [];

        const itemList = await this._remindMessageRepo.findBy({ id: In(idList) });
        if (!Helpers.isFilledArray(idList)) return [];

        itemList.forEach((item) => (item.is_deleted = 1));

        await this._remindMessageRepo.save(itemList);

        return itemList.map((item) => mapper.map(item, RemindMessageEntity, RemindMessageDTO));
    }
}
