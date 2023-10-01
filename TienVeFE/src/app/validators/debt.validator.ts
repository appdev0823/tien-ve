import { SaveDebtDTO } from '../dtos/debt.dto';
import { Helpers } from '../utils';
import { BaseValidator } from './base.validator';

export class DebtValidator extends BaseValidator {
    /**
     * Validate các dòng dữ liệu thu được từ file Excel được upload
     * @param debt - Dòng dữ liệu thu được từ file Excel, các fields bị lỗi sẽ bị đánh dấu
     * @returns Các error message lỗi
     */
    public validateOne(
        debt: SaveDebtDTO & {
            invalid_keys?: {
                [K in keyof SaveDebtDTO]?: boolean;
            };
        },
    ) {
        const errorMessageList: string[] = [];

        const payerNameLbl = String(this.translate$.instant('label.payer_name'));
        const payerPhoneLbl = String(this.translate$.instant('label.payer_phone'));
        const amountLbl = String(this.translate$.instant('label.amount'));
        const bankAccountIdLbl = String(this.translate$.instant('label.receive_money_account'));

        const errPayerNameRequired = `${payerNameLbl}: ${String(this.translate$.instant('validation.required', { item: '' })).toLowerCase()}`;
        const errPayerPhoneRequired = `${payerPhoneLbl}: ${String(this.translate$.instant('validation.required', { item: '' })).toLowerCase()}`;
        const errAmountRequired = `${amountLbl}: ${String(this.translate$.instant('validation.required', { item: '' })).toLowerCase()}`;
        const errBankAccountIdRequired = `${bankAccountIdLbl}: ${String(this.translate$.instant('validation.required', { item: '' })).toLowerCase()}`;

        const errPayerPhoneMaxLength = `${payerPhoneLbl}: ${String(this.translate$.instant('validation.maxlength', { num: this.PHONE_ML })).toLowerCase()}`;
        const errPayerPhoneFormat = `${payerPhoneLbl}: ${String(this.translate$.instant('validation.phone')).toLowerCase()}`;

        const errAmountMin = `${amountLbl}: ${String(this.translate$.instant('validation.min', { name: '', num: 1 })).toLowerCase()}`;
        const errAmountMax = `${amountLbl}: ${String(this.translate$.instant('validation.max', { name: '', num: this.DECIMAL_15_3_MAX })).toLowerCase()}`;

        debt.invalid_keys = {};

        if (!debt.payer_name) {
            errorMessageList.push(errPayerNameRequired);
            debt.invalid_keys.payer_name = true;
        }

        if (!debt.payer_phone) {
            errorMessageList.push(errPayerPhoneRequired);
            debt.invalid_keys.payer_phone = true;
        } else if (debt.payer_phone.length > this.PHONE_ML) {
            errorMessageList.push(errPayerPhoneMaxLength);
            debt.invalid_keys.payer_phone = true;
        } else {
            const regex = Helpers.getPhoneNumberRegex();
            const test = debt.payer_phone.match(regex);
            if (!test) {
                errorMessageList.push(errPayerPhoneFormat);
                debt.invalid_keys.payer_phone = true;
            }
        }

        if (!debt.amount) {
            errorMessageList.push(errAmountRequired);
            debt.invalid_keys.amount = true;
        } else if (debt.amount < 1) {
            errorMessageList.push(errAmountMin);
            debt.invalid_keys.amount = true;
        } else if (debt.amount >= this.DECIMAL_15_3_MAX) {
            errorMessageList.push(errAmountMax);
            debt.invalid_keys.amount = true;
        }

        if (!debt.bank_account_id) {
            errorMessageList.push(errBankAccountIdRequired);
            debt.invalid_keys.bank_account_id = true;
        }

        return errorMessageList;
    }
}
