import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as dayjs from 'dayjs';
import { NgOtpInputComponent } from 'ng-otp-input';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import { LoginUserDTO, OtpDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { AuthService, OtpService } from 'src/app/services';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import { AuthValidator } from 'src/app/validators';
import { CustomValidators } from 'src/app/validators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends PageComponent {
    public validator = new AuthValidator();

    public loginForm = this.validator.getLoginForm();
    public otpForm = this.validator.getOtpForm();
    public saveAccountForm = this.validator.getSaveAccountForm();

    /** 1: login, 2: validate otp, 3: save account */
    public mode: 1 | 2 | 3 = 1;

    private _createdOtp = new OtpDTO();
    /** Countdown interval */
    private _otpCountdownInterval?: NodeJS.Timeout;
    /** Lượng thời gian còn lại để hiển thị cho người dùng */
    public remainingTime = '';
    /** Thời gian (s) còn lại */
    private _remainingSeconds = 0;
    @ViewChild('otpInput', { static: false }) otpInput?: NgOtpInputComponent;

    private _loginUser = new LoginUserDTO();

    /** Constructor */
    constructor(private _translate$: TranslateService, private _auth$: AuthService, private _otp$: OtpService, private _toast$: AppToastService, private _router: Router) {
        super();
    }

    public onTypeChanged() {
        this.loginForm.clearControlErrorMessages();
        this.loginForm.controls.email_phone.reset();

        const type = this.loginForm.value.type;

        const formatValidator = type === this.CONSTANTS.LOGIN_TYPES.EMAIL ? Validators.email : CustomValidators.phone;
        const errorMsg = this._translate$.instant('validation.required', {
            item: String(this._translate$.instant(`label.${type === this.CONSTANTS.LOGIN_TYPES.EMAIL ? 'email' : 'phone'}`)).toLowerCase(),
        }) as string;

        this.loginForm.controls.email_phone.setValidators([Validators.required, formatValidator]);
        if (this.loginForm.controlValidationMessages.email_phone) {
            this.loginForm.controlValidationMessages.email_phone['required'] = errorMsg;
        }
    }

    public async sendOtp(isResend = false) {
        if (isResend) {
            this.otpInput?.setValue('');
            this.otpForm.reset();
            this.otpForm.clearControlErrorMessages();
        }

        this.loginForm.clearControlErrorMessages();
        if (!this.loginForm.valid || !this.helpers.isString(this.loginForm.value.email_phone) || !this.loginForm.value.type) {
            this.loginForm.setControlErrorMessages();
            return;
        }

        const result = await this._otp$.create(this.loginForm.value.email_phone, this.loginForm.value.type);
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this._translate$.instant(`message.${result.message}`));
            this._toast$.error(errMsg);
            return;
        }

        const successMsg = String(this._translate$.instant('message.otp_sent_successfully'));
        this._toast$.success(successMsg);

        this.mode = 2;
        this._createdOtp = result.data;

        const current = dayjs();
        const expiredDate = dayjs(this._createdOtp.expired_date, this.CONSTANTS.MYSQL_DATETIME_FORMAT);
        this._remainingSeconds = expiredDate.diff(current, 'seconds');

        this._otpCountdownInterval = setInterval(() => {
            const minutes = Math.floor(this._remainingSeconds / 60);
            const seconds = this._remainingSeconds % 60;
            this.remainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (this._remainingSeconds <= 0) {
                clearInterval(this._otpCountdownInterval);
                this._otpCountdownInterval = undefined;
            } else {
                this._remainingSeconds--;
            }
        }, 1000);
    }

    public viewLoginMode() {
        this.mode = 1;

        this.loginForm.clearControlErrorMessages();
        this.otpForm = this.validator.getOtpForm();
        this.saveAccountForm = this.validator.getSaveAccountForm();

        this._createdOtp = new OtpDTO();
        this._otpCountdownInterval = undefined;
        this.remainingTime = '';
        this._remainingSeconds = 0;
    }

    public async onOtpFormSubmitted() {
        this.otpForm.clearControlErrorMessages();
        if (!this.otpForm.valid || !this.helpers.isString(this.otpForm.value.otp)) {
            this.otpForm.setControlErrorMessages();
            return;
        }

        const emailPhone = this.loginForm.value.email_phone;
        const type = this.loginForm.value.type;
        if (!emailPhone || !type) return;

        const result = await this._auth$.loginOtp(this._createdOtp.id, this.otpForm.value.otp, emailPhone, type);
        if (!result.isSuccess || !result.data) {
            const errMsg = this._translate$.instant(`message.${result.message}`) as string;
            this._toast$.error(errMsg);
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

        const { email, phone, name } = this.saveAccountForm.value;
        if (!email || !phone || !name) return;

        const result = await this._auth$.saveAccount({ email, phone, name });
        if (!result.isSuccess || !result.data) {
            const errMsg = this._translate$.instant(`message.${result.message}`) as string;
            this._toast$.error(errMsg);
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
