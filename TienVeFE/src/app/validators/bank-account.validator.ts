import { FormControl, Validators } from '@angular/forms';
import { AppFormGroup } from '../utils';
import { BaseValidator } from './base.validator';
import { CustomValidators } from './custom.validators';

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
                required: this._translate$.instant('validation.required', {
                    item: 'ngân hàng',
                }) as string,
            },
            branch_name: {
                required: this._translate$.instant('validation.required', {
                    item: 'tên chi nhánh',
                }) as string,
            },
            account_number: {
                required: this._translate$.instant('validation.required', {
                    item: 'số tài khoản',
                }) as string,
                maxlength: this._translate$.instant('validation.maxlength', {
                    num: this.ACCOUNT_NUMBER_ML,
                }) as string,
            },
            card_owner: {
                required: this._translate$.instant('validation.required', {
                    item: 'tên chủ tài khoản',
                }) as string,
            },
            phone: {
                required: this._translate$.instant('validation.required', {
                    item: String(this._translate$.instant('label.phone')).toLowerCase(),
                }) as string,
                phone: this._translate$.instant('validation.phone', {
                    item: String(this._translate$.instant('label.phone')),
                }) as string,
            },
        };

        return form;
    }
}
