import { inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppFormGroup, CONSTANTS } from '../utils';
import { ValueOf } from '../utils/types';
import { CustomValidators } from './custom.validators';

export class AuthValidator {
    private _translate$ = inject(TranslateService);

    /**
     * Get login form group
     */
    public getLoginForm() {
        const form = new AppFormGroup({
            email_phone: new FormControl('', [Validators.required, Validators.email]),
            type: new FormControl<ValueOf<typeof CONSTANTS.LOGIN_TYPES>>(CONSTANTS.LOGIN_TYPES.EMAIL),
        });

        form.controlValidationMessages = {
            email_phone: {
                required: this._translate$.instant('validation.required', {
                    item: String(this._translate$.instant('label.email')).toLowerCase(),
                }) as string,
                email: this._translate$.instant('validation.email', {
                    item: String(this._translate$.instant('label.email')),
                }) as string,
                phone: this._translate$.instant('validation.phone', {
                    item: String(this._translate$.instant('label.phone')),
                }) as string,
            },
        };

        return form;
    }

    public getOtpForm() {
        const form = new AppFormGroup({
            otp: new FormControl('', [Validators.required]),
        });

        form.controlValidationMessages = {
            otp: {
                required: this._translate$.instant('validation.required', {
                    item: String(this._translate$.instant('label.otp_code')).toLowerCase(),
                }) as string,
            },
        };

        return form;
    }

    public getSaveAccountForm() {
        const form = new AppFormGroup({
            email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
            phone: new FormControl<string | null>(null, [Validators.required, CustomValidators.phone]),
            name: new FormControl<string | null>(null, [Validators.required]),
        });

        form.controlValidationMessages = {
            email: {
                required: this._translate$.instant('validation.required', {
                    item: String(this._translate$.instant('label.email')).toLowerCase(),
                }) as string,
                email: this._translate$.instant('validation.email', {
                    item: String(this._translate$.instant('label.email')),
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
            name: {
                required: this._translate$.instant('validation.required', {
                    item: String(this._translate$.instant('label.name')).toLowerCase(),
                }) as string,
            },
        };

        return form;
    }
}
