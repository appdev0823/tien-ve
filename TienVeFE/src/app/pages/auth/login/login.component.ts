import { Component } from '@angular/core';
import { Router } from '@angular/router';
import PageComponent from 'src/app/includes/page.component';
import { AuthService } from 'src/app/services';
import { AuthValidator } from 'src/app/validators';
import { Md5 } from 'ts-md5';
import { saveAuthStateAction } from './../../../store/auth/auth.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends PageComponent {
    public validator = new AuthValidator();
    public form = this.validator.getLoginForm();

    /** Constructor */
    constructor(private _auth$: AuthService, private _router: Router) {
        super();
    }

    /**
     * On form submitted
     */
    public onSubmit() {
        this.form.clearControlErrorMessages();
        if (!this.form.valid || !this.helpers.isString(this.form.value.email_phone) || !this.helpers.isString(this.form.value.password)) {
            this.form.setControlErrorMessages();
            return;
        }

        this._auth$.login(this.form.value.email_phone, Md5.hashStr(this.form.value.password)).subscribe((result) => {
            if (!result.isSuccess || !result.data) {
                if (result.errors) {
                    this.form.setErrorMessagesFromValidationErrors(result.errors);
                    return;
                }

                const errMsg = this.translate$.instant(`message.${result.message}`) as string;
                this.toast$.error(errMsg);
                return;
            }

            this.store.dispatch(saveAuthStateAction({ payload: result.data }));

            const dashboardRoute = `${this.ROUTES.DASHBOARD}`;
            void this._router.navigate([dashboardRoute]);
        });
    }
}
