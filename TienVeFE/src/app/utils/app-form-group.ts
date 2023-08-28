import { AbstractControl, FormGroup } from '@angular/forms';
import Helpers from './helpers';

export default class AppFormGroup<
    Controls extends {
        [C in keyof Controls]: AbstractControl<any>;
    },
> extends FormGroup<Controls> {
    /** Error messages of controls of form */
    public controlErrorMessages: { [C in keyof Controls]?: string } = {};

    /** All validation messages of controls of form */
    public controlValidationMessages: {
        [C in keyof Controls]?: {
            [key: string]: string;
        };
    } = {};

    /**
     * Clear error messages of controls
     */
    public clearControlErrorMessages() {
        this.controlErrorMessages = {};
    }

    /**
     * Set error messages of controls of form based on validation messages
     */
    public setControlErrorMessages() {
        if (this.valid) return;

        for (const controlName in this.controls) {
            if (Object.prototype.hasOwnProperty.call(this.controls, controlName)) {
                const control = this.controls[controlName];
                if (control.valid || !control.errors) continue;

                const controlMessages = this.controlValidationMessages[controlName];

                const controlErrorKeyList = Object.keys(control.errors);
                if (!Helpers.isFilledArray(controlErrorKeyList)) return;

                const firstErrorKey = controlErrorKeyList[0];
                const ctrlMsg = controlMessages?.[firstErrorKey];
                if (Helpers.isString(ctrlMsg)) this.controlErrorMessages[controlName] = ctrlMsg;
            }
        }
    }

    /**
     * Set error messages of controls based on API validation errors
     * @param errors - validation errors responded from API
     */
    public setErrorMessagesFromValidationErrors(errors: { [key: string]: string }) {
        const errorEntries = Object.entries(errors);
        const controlsNameList = Object.keys(this.controls);

        // type casting to bypass TS
        const ctrlValidationMessages = this.controlValidationMessages as { [key: string]: { [key: string]: string } };
        const controlErrMessages = this.controlErrorMessages as { [key: string]: string };

        for (const [ctrlKey, errMsgKey] of errorEntries) {
            if (!controlsNameList.includes(ctrlKey)) return;
            if (!ctrlValidationMessages[ctrlKey] || !Helpers.isString(ctrlValidationMessages[ctrlKey][errMsgKey])) return;

            // controlErrMessages refers to this.controlErrorMessages, no need to set again
            controlErrMessages[ctrlKey] = ctrlValidationMessages[ctrlKey][errMsgKey];
        }
    }
}
