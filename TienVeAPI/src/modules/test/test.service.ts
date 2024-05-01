import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { BankService } from '../bank/bank.service';
import { Helpers } from 'src/utils';
import { ExtractedSMSInfo } from 'src/utils/types';

@Injectable()
export class TestService {
    /** Constructor */
    constructor(private readonly _messageService: MessageService, private readonly _bankService: BankService) {}

    public async test_MessageService_extractSMS() {
        const bankList = await this._bankService.getList();
        if (!Helpers.isFilledArray(bankList)) return false;

        for (const bank of bankList) {
            let example = '';
            let expectedResult: ExtractedSMSInfo | null = null;
            const brandName = bank.brand_name.toLowerCase();

            if (!bank.use_extract_sms_template) continue;

            if (brandName === 'mbbank') {
                example = 'TK 03xxx422 GD: +22,000VND 07/04/24 06:52  SD: 406,180VND TU: 19035784911011 ND: TV-150324-00001-00001';
                expectedResult = {
                    account_number: '03xxx422',
                    amount: '+22,000',
                    balance: '406,180',
                    debt_id: 'TV-150324-00001-00001',
                };
            }

            if (brandName === 'sacombank') {
                example = 'Sacombank 01/05/2024 22:04 TK: 060201746607 PS: +5,000 VND So du kha dung: 231,466 VND TV-150324-00001-00001';
                expectedResult = {
                    account_number: '060201746607',
                    amount: '+5,000',
                    balance: '231,466',
                    debt_id: 'TV-150324-00001-00001',
                };
            }

            if (brandName === 'tpbank') {
                example = '(TPBank): 20/04/24;09:13 TK: xxxx1662401 PS:-1.000.000VND SD: 1.023.469VND SD KHA DUNG: 1.023.469VND ';
                expectedResult = {
                    account_number: 'xxxx1662401',
                    amount: '-1.000.000',
                    balance: '1.023.469',
                    debt_id: '',
                };
            }

            if (brandName === 'acb') {
                example = 'ACB: TK 99993588(VND) - 1,500,000 luc 14:57 28/04/2024. So du 52,672. GD: TV-150324-00001-00001';
                expectedResult = {
                    account_number: '99993588',
                    amount: '- 1,500,000',
                    balance: '52,672',
                    debt_id: 'TV-150324-00001-00001',
                };
            }

            if (!expectedResult) return false;

            const result = this._messageService.extractSMS(example, bank);
            if (!result) return false;

            if (
                result.account_number !== expectedResult.account_number ||
                result.amount !== expectedResult.amount ||
                result.balance !== expectedResult.balance ||
                result.debt_id !== expectedResult.debt_id
            )
                return false;
        }

        return true;
    }
}
