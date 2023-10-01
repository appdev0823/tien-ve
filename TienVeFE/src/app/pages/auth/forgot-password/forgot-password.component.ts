import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NgOtpInputComponent } from 'ng-otp-input';
import { OtpDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { AuthService, OtpService, UserService } from 'src/app/services';
import { AuthValidator, CustomValidators } from 'src/app/validators';
import { Md5 } from 'ts-md5';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends PageComponent {
    public validator = new AuthValidator();

    public forgotPasswordForm = this.validator.getForgotPasswordForm();
    public otpForm = this.validator.getOtpForm();
    public renewPasswordForm = this.validator.getRenewPasswordForm();

    /** 1: forgot password, 2: validate otp, 3: renew password */
    public mode: 1 | 2 | 3 = 1;

    private _createdOtp = new OtpDTO();
    /** Countdown interval */
    private _otpCountdownInterval?: NodeJS.Timeout;
    /** Lượng thời gian còn lại để hiển thị cho người dùng */
    public otpRemainingTime = '';
    /** Thời gian (s) còn lại */
    private _otpRemainingSeconds = 0;
    @ViewChild('otpInput', { static: false }) otpInput?: NgOtpInputComponent;

    /** Countdown interval */
    private _resendOtpCountdownInterval?: NodeJS.Timeout;
    /** Lượng thời gian còn lại để resend OTP */
    public resendOtpRemainingTime = '';
    /** Thời gian (s) còn lại để resend OTP */
    private _resendOtpRemainingSeconds = this.CONSTANTS.OTP.RESEND_SECONDS;

    private _forgotPasswordAccessToken = '';

    /** Constructor */
    constructor(private _auth$: AuthService, private _otp$: OtpService, private _user$: UserService, private _router: Router) {
        super();
    }

    public onTypeChanged() {
        this.forgotPasswordForm.clearControlErrorMessages();
        this.forgotPasswordForm.controls.email_phone.reset();

        const type = this.forgotPasswordForm.value.type;

        const formatValidator = type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? Validators.email : CustomValidators.phone;
        const errorMsg = this.translate$.instant('validation.required', {
            item: String(this.translate$.instant(`label.${type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? 'email' : 'phone'}`)).toLowerCase(),
        }) as string;

        this.forgotPasswordForm.controls.email_phone.setValidators([Validators.required, formatValidator]);
        if (this.forgotPasswordForm.controlValidationMessages.email_phone) {
            this.forgotPasswordForm.controlValidationMessages.email_phone['required'] = errorMsg;
        }
    }

    public async sendOtp(isResend = false) {
        if (isResend) {
            this.otpInput?.setValue('');
            this.otpForm.reset();
            this.otpForm.clearControlErrorMessages();
            this._resendOtpRemainingSeconds = this.CONSTANTS.OTP.RESEND_SECONDS;
            clearInterval(this._otpCountdownInterval);
            clearInterval(this._resendOtpCountdownInterval);
        }

        this.forgotPasswordForm.clearControlErrorMessages();
        if (!this.forgotPasswordForm.valid || !this.helpers.isString(this.forgotPasswordForm.value.email_phone) || !this.forgotPasswordForm.value.type) {
            this.forgotPasswordForm.setControlErrorMessages();
            return;
        }

        const existenceResult = await this._user$.getByEmailPhone(this.forgotPasswordForm.value.email_phone);
        if (!existenceResult.data) {
            const errMsgKey = this.forgotPasswordForm.value.type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? 'err_email_not_exists' : 'err_phone_not_exists';
            const errMsg = String(this.translate$.instant(`message.${errMsgKey}`));
            this.toast$.error(errMsg);
            return;
        }

        const result = await this._otp$.create(this.forgotPasswordForm.value.email_phone, this.forgotPasswordForm.value.type);
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.otp_sent_successfully'));
        this.toast$.success(successMsg);

        this.mode = 2;
        this._createdOtp = result.data;

        const current = dayjs();
        const expiredDate = dayjs(this._createdOtp.expired_date, this.CONSTANTS.MYSQL_DATETIME_FORMAT);
        this._otpRemainingSeconds = expiredDate.diff(current, 'seconds');

        this._otpCountdownInterval = setInterval(() => {
            const minutes = Math.floor(this._otpRemainingSeconds / 60);
            const seconds = this._otpRemainingSeconds % 60;
            this.otpRemainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (this._otpRemainingSeconds <= 0) {
                clearInterval(this._otpCountdownInterval);
                this._otpCountdownInterval = undefined;
            } else {
                this._otpRemainingSeconds--;
            }
        }, 1000);

        this._resendOtpCountdownInterval = setInterval(() => {
            const minutes = Math.floor(this._resendOtpRemainingSeconds / 60);
            const seconds = this._resendOtpRemainingSeconds % 60;
            this.resendOtpRemainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (this._resendOtpRemainingSeconds <= 0) {
                clearInterval(this._resendOtpCountdownInterval);
                this._resendOtpCountdownInterval = undefined;
            } else {
                this._resendOtpRemainingSeconds--;
            }
        }, 1000);
    }

    public viewForgotPasswordMode() {
        this.mode = 1;

        this.forgotPasswordForm.clearControlErrorMessages();
        this.otpForm = this.validator.getOtpForm();
        this.renewPasswordForm = this.validator.getRenewPasswordForm();

        this._createdOtp = new OtpDTO();
        this._otpCountdownInterval = undefined;
        this.otpRemainingTime = '';
        this._otpRemainingSeconds = 0;
    }

    public async onOtpFormSubmitted() {
        this.otpForm.clearControlErrorMessages();
        if (!this.otpForm.valid || !this.helpers.isString(this.otpForm.value.otp)) {
            this.otpForm.setControlErrorMessages();
            return;
        }

        const emailPhone = this.forgotPasswordForm.value.email_phone;
        if (!emailPhone) return;

        const result = await this._auth$.validateForgotPasswordOtp(this._createdOtp.id, this.otpForm.value.otp, emailPhone);
        if (!result.isSuccess || !result.data) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        this._forgotPasswordAccessToken = result.data;
        this.mode = 3;
    }

    public async onRenewPassword() {
        this.renewPasswordForm.clearControlErrorMessages();
        if (!this.renewPasswordForm.valid) {
            this.renewPasswordForm.setControlErrorMessages();
            return;
        }

        const { password } = this.renewPasswordForm.value;
        if (!password) return;

        const result = await this._auth$.renewPassword(this._forgotPasswordAccessToken, Md5.hashStr(password));
        if (!result.isSuccess) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        await this._router.navigate([`/${this.ROUTES.AUTH.MODULE}/${this.ROUTES.AUTH.LOGIN}`]);
    }
}
