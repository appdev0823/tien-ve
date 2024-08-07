import { AutoMap } from '@automapper/classes';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('m_banks')
export class BankEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    @AutoMap()
        id: number;

    @Column({ type: 'varchar', length: 100 })
    @AutoMap()
        brand_name: string;

    @Column({ type: 'varchar', length: 255 })
    @AutoMap()
        name: string;

    @Column({ type: 'varchar', length: 100 })
    @AutoMap()
        account_number_start: string;

    @Column({ type: 'varchar', length: 100 })
    @AutoMap()
        balance_start: string;

    @Column({ type: 'varchar', length: 1000 })
    @AutoMap()
        extract_sms_template: string;

    @Column({ type: 'tinyint', default: 0 })
    @AutoMap()
        use_extract_sms_template: string;

    @Column({ type: 'varchar', length: 255 })
    @AutoMap()
        img_path: string;

    @Column({ type: 'tinyint', default: 1 })
    @AutoMap()
        is_deleted: 0 | 1;

    @CreateDateColumn({ type: 'datetime' })
    @AutoMap()
        created_date: string;

    @UpdateDateColumn({ type: 'datetime' })
    @AutoMap()
        updated_date: string;

    @BeforeInsert()
    beforeInsert() {
        this.created_date = new Date().toISOString();
        this.updated_date = new Date().toISOString();
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updated_date = new Date().toISOString();
    }
}
