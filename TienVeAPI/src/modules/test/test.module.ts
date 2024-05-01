import { Module } from '@nestjs/common';
import { BankAccountRepository, BankRepository, MessageRepository } from 'src/repository';
import { BankService } from '../bank/bank.service';
import { MessageService } from '../message/message.service';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
    controllers: [TestController],
    providers: [TestService, MessageService, MessageRepository, BankService, BankRepository, BankAccountRepository],
})
export class TestModule {}
