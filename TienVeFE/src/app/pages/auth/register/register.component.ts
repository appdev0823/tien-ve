import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NgOtpInputComponent } from 'ng-otp-input';
import { LoginUserDTO, OtpDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { AuthService, OtpService, UserService } from 'src/app/services';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import { AuthValidator, CustomValidators } from 'src/app/validators';
import { Md5 } from 'ts-md5';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends PageComponent {
    public validator = new AuthValidator();

    public registerForm = this.validator.getRegisterForm();
    public otpForm = this.validator.getOtpForm();
    public saveAccountForm = this.validator.getSaveAccountForm();

    /** 1: register, 2: validate otp, 3: save account */
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

    private _loginUser = new LoginUserDTO();

    /** Constructor */
    constructor(private _auth$: AuthService, private _otp$: OtpService, private _user$: UserService, private _router: Router) {
        super();
    }

    public onTypeChanged() {
        this.registerForm.clearControlErrorMessages();
        this.registerForm.controls.email_phone.reset();

        const type = this.registerForm.value.type;

        const formatValidator = type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? Validators.email : CustomValidators.phone;
        const errorMsg = this.translate$.instant('validation.required', {
            item: String(this.translate$.instant(`label.${type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? 'email' : 'phone'}`)).toLowerCase(),
        }) as string;

        this.registerForm.controls.email_phone.setValidators([Validators.required, formatValidator]);
        if (this.registerForm.controlValidationMessages.email_phone) {
            this.registerForm.controlValidationMessages.email_phone['required'] = errorMsg;
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

        this.registerForm.clearControlErrorMessages();
        if (!this.registerForm.valid || !this.helpers.isString(this.registerForm.value.email_phone) || !this.registerForm.value.type) {
            this.registerForm.setControlErrorMessages();
            return;
        }

        const existenceResult = await this._user$.getByEmailPhone(this.registerForm.value.email_phone);
        if (existenceResult.data) {
            const errMsgKey = this.registerForm.value.type === this.CONSTANTS.REGISTER_TYPES.EMAIL ? 'err_email_exists' : 'err_phone_exists';
            const errMsg = String(this.translate$.instant(`message.${errMsgKey}`));
            this.toast$.error(errMsg);
            return;
        }

        const result = await this._otp$.create(this.registerForm.value.email_phone, this.registerForm.value.type);
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

    public viewRegisterMode() {
        this.mode = 1;

        this.registerForm.clearControlErrorMessages();
        this.otpForm = this.validator.getOtpForm();
        this.saveAccountForm = this.validator.getSaveAccountForm();

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

        const emailPhone = this.registerForm.value.email_phone;
        const type = this.registerForm.value.type;
        if (!emailPhone || !type) return;

        const result = await this._auth$.register(this._createdOtp.id, this.otpForm.value.otp, emailPhone, type, this.registerForm.value.is_long_token ? true : false);
        if (!result.isSuccess || !result.data) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        this.store.dispatch(saveAuthStateAction({ payload: result.data }));
        this._loginUser = result.data;

        // Thông tin user đăng nhập không có name | email | phone thì yêu cầu update
        if (!this.helpers.isString(result.data.name) || !this.helpers.isString(result.data.email) || !this.helpers.isString(result.data.phone)) {
            this.mode = 3;
            if (this.helpers.isString(result.data.name)) this.saveAccountForm.controls.name.setValue(result.data.name);
            if (this.helpers.isString(result.data.email)) this.saveAccountForm.controls.email.setValue(result.data.email);
            if (this.helpers.isString(result.data.phone)) this.saveAccountForm.controls.phone.setValue(result.data.phone);
            return;
        }

        await this._router.navigate([this.ROUTES.DASHBOARD]);
    }

    public async onUpdateAccount() {
        this.saveAccountForm.clearControlErrorMessages();
        if (!this.saveAccountForm.valid) {
            this.saveAccountForm.setControlErrorMessages();
            return;
        }

        const { email, phone, name, password } = this.saveAccountForm.value;
        if (!email || !phone || !name || !password) return;

        const result = await this._auth$.saveAccount({ email, phone, name, password: Md5.hashStr(password) });
        if (!result.isSuccess || !result.data) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        const updatedLoginUser = new LoginUserDTO();
        updatedLoginUser.id = this._loginUser.id;
        updatedLoginUser.email = this._loginUser.email;
        updatedLoginUser.phone = this._loginUser.phone;
        updatedLoginUser.name = this._loginUser.name;
        updatedLoginUser.is_active = this._loginUser.is_active;
        updatedLoginUser.created_date = this._loginUser.created_date;
        updatedLoginUser.updated_date = this._loginUser.updated_date;
        updatedLoginUser.access_token = this._loginUser.access_token;

        this.store.dispatch(saveAuthStateAction({ payload: updatedLoginUser }));

        await this._router.navigate([this.ROUTES.DASHBOARD]);
    }
}
