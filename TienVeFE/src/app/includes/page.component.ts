import { NgOtpInputConfig } from 'ng-otp-input';
import BaseComponent from './base.component';

/** Base class of all page components */
export default class PageComponent extends BaseComponent {
    public isPageLoaded = false;
    public currentPage = 1;
    /** Cấu hình OTP Input */
    public otpInputConfig: NgOtpInputConfig = {
        allowNumbersOnly: true,
        length: this.CONSTANTS.OTP.LENGTH,
        isPasswordInput: false,
        disableAutoFocus: false,
    };
}
