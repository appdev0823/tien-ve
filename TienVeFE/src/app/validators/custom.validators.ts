import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Helpers } from '../utils';

export class CustomValidators {
    static checkPassword = (control: AbstractControl): ValidationErrors | null => {
        if (control == null) {
            return null;
        }
        if (!Helpers.isString(control.value)) {
            return null;
        }
        const test = control.value.match(/^[a-zA-Z0-9!@?#$%^&*<>()]+$/);
        if (test) {
            return null;
        }
        return { password: true };
    };

    static match = (matchControl: string): ValidatorFn => (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.parent == null || control.parent.controls == null || !Helpers.isString(control.value)) {
            return null;
        }
        const controls = control.parent.controls as { [key: string]: any };
        const matchCtrl = controls[matchControl];
        if (matchCtrl == null || matchCtrl.errors) {
            return null;
        }
        if (matchCtrl.value !== control.value) {
            return { match: true };
        }
        return null;
    };
}
