import { FormControl, Validators } from '@angular/forms';
import { AppFormGroup, CONSTANTS } from '../utils';
import { ValueOf } from '../utils/types';
import { BaseValidator } from './base.validator';
import { CustomValidators } from './custom.validators';

export class AuthValidator extends BaseValidator {
    public readonly PASSWORD_MIN = 6;

    /**
     * Get login form group
     */
    public getLoginForm() {
        const form = new AppFormGroup({
            email_phone: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });

        form.controlValidationMessages = {
            email_phone: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.email_phone')).toLowerCase(),
                }) as string,
            },
            password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.password')).toLowerCase(),
                }) as string,
            },
        };

        return form;
    }

    /**
     * Get change password form group
     */
    public getChangePasswordForm() {
        const form = new AppFormGroup({
            old_password: new FormControl('', [Validators.required]),
            new_password: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_MIN), CustomValidators.password, CustomValidators.match('confirm_new_password')]),
            confirm_new_password: new FormControl('', [Validators.required, CustomValidators.match('new_password')]),
        });

        form.controlValidationMessages = {
            old_password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.old_password')).toLowerCase(),
                }) as string,
            },
            new_password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.new_password')).toLowerCase(),
                }) as string,
                minlength: this.translate$.instant('validation.minlength', {
                    num: this.PASSWORD_MIN,
                }) as string,
                password: this.translate$.instant('validation.password', {
                    field: String(this.translate$.instant('label.new_password')),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.new_password') as string,
                    name2: this.translate$.instant('label.confirm_new_password') as string,
                }) as string,
            },
            confirm_new_password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.confirm_new_password')).toLowerCase(),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.new_password') as string,
                    name2: this.translate$.instant('label.confirm_new_password') as string,
                }) as string,
            },
        };

        return form;
    }

    public getRegisterForm() {
        const form = new AppFormGroup({
            email_phone: new FormControl('', [Validators.required, Validators.email]),
            type: new FormControl<ValueOf<typeof CONSTANTS.REGISTER_TYPES>>(CONSTANTS.REGISTER_TYPES.EMAIL),
            is_long_token: new FormControl(true),
            is_policy_accepted: new FormControl(true),
        });

        form.controlValidationMessages = {
            email_phone: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.email')).toLowerCase(),
                }) as string,
                email: this.translate$.instant('validation.email', {
                    item: String(this.translate$.instant('label.email')),
                }) as string,
                phone: this.translate$.instant('validation.phone', {
                    item: String(this.translate$.instant('label.phone')),
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
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.otp_code')).toLowerCase(),
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
            password: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_MIN), CustomValidators.password, CustomValidators.match('confirm_password')]),
            confirm_password: new FormControl('', [Validators.required, CustomValidators.match('password')]),
        });

        form.controlValidationMessages = {
            email: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.email')).toLowerCase(),
                }) as string,
                email: this.translate$.instant('validation.email', {
                    item: String(this.translate$.instant('label.email')),
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
            name: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.name')).toLowerCase(),
                }) as string,
            },
            password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.password')).toLowerCase(),
                }) as string,
                minlength: this.translate$.instant('validation.minlength', {
                    num: this.PASSWORD_MIN,
                }) as string,
                password: this.translate$.instant('validation.password', {
                    field: String(this.translate$.instant('label.password')),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.password') as string,
                    name2: this.translate$.instant('label.confirm_password') as string,
                }) as string,
            },
            confirm_password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.confirm_password')).toLowerCase(),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.password') as string,
                    name2: this.translate$.instant('label.confirm_password') as string,
                }) as string,
            },
        };

        return form;
    }

    public getForgotPasswordForm() {
        const form = new AppFormGroup({
            email_phone: new FormControl('', [Validators.required, Validators.email]),
            type: new FormControl<ValueOf<typeof CONSTANTS.REGISTER_TYPES>>(CONSTANTS.REGISTER_TYPES.EMAIL),
        });

        form.controlValidationMessages = {
            email_phone: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.email')).toLowerCase(),
                }) as string,
                email: this.translate$.instant('validation.email', {
                    item: String(this.translate$.instant('label.email')),
                }) as string,
                phone: this.translate$.instant('validation.phone', {
                    item: String(this.translate$.instant('label.phone')),
                }) as string,
            },
        };

        return form;
    }

    public getRenewPasswordForm() {
        const form = new AppFormGroup({
            password: new FormControl('', [Validators.required, Validators.minLength(this.PASSWORD_MIN), CustomValidators.password, CustomValidators.match('confirm_password')]),
            confirm_password: new FormControl('', [Validators.required, CustomValidators.match('password')]),
        });

        form.controlValidationMessages = {
            password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.password')).toLowerCase(),
                }) as string,
                minlength: this.translate$.instant('validation.minlength', {
                    num: this.PASSWORD_MIN,
                }) as string,
                password: this.translate$.instant('validation.password', {
                    field: String(this.translate$.instant('label.password')),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.password') as string,
                    name2: this.translate$.instant('label.confirm_password') as string,
                }) as string,
            },
            confirm_password: {
                required: this.translate$.instant('validation.required', {
                    item: String(this.translate$.instant('label.confirm_password')).toLowerCase(),
                }) as string,
                match: this.translate$.instant('validation.match', {
                    name1: this.translate$.instant('label.password') as string,
                    name2: this.translate$.instant('label.confirm_password') as string,
                }) as string,
            },
        };

        return form;
    }
}
