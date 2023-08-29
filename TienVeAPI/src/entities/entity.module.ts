import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity, OtpEntity, UserEntity } from './index';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, MessageEntity, OtpEntity])],
    exports: [TypeOrmModule],
})
export class EntityModule {}
