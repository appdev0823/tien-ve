import { FormControl, Validators } from '@angular/forms';
import { AppFormGroup, CONSTANTS } from '../utils';
import { BaseValidator } from './base.validator';
import { CustomValidators } from './custom.validators';
import { ValueOf } from '../utils/types';

export class BankAccountValidator extends BaseValidator {
    public readonly ACCOUNT_NUMBER_ML = 20;

    public getSaveForm() {
        const form = new AppFormGroup({
            bank_id: new FormControl<number | null>(null, [Validators.required]),
            branch_name: new FormControl('', [Validators.required]),
            account_number: new FormControl('', [Validators.required, Validators.maxLength(this.ACCOUNT_NUMBER_ML)]),
            card_owner: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required, CustomValidators.phone]),
            name: new FormControl<string | null>(null),
        });

        form.controlValidationMessages = {
            bank_id: {
                required: this.translate$.instant('validation.required', {
                    item: 'ngân hàng',
                }) as string,
            },
            branch_name: {
                required: this.translate$.instant('validation.required', {
                    item: 'tên chi nhánh',
                }) as string,
            },
            account_number: {
                required: this.translate$.instant('validation.required', {
                    item: 'số tài khoản',
                }) as string,
                maxlength: this.translate$.instant('validation.maxlength', {
                    num: this.ACCOUNT_NUMBER_ML,
                }) as string,
            },
            card_owner: {
                required: this.translate$.instant('validation.required', {
                    item: 'tên chủ tài khoản',
                }) as string,
            },
            phone: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.phone')).toLowerCase(),
                }) as string,
                phone: this.translate$.instant('validation.phone', {
                    item: String(this.translate$.instant('label.phone')),
                }) as string,
            },
        };

        return form;
    }
}
