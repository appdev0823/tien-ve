import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import PageComponent from 'src/app/includes/page.component';
import { AuthService } from 'src/app/services';
import { Md5 } from 'ts-md5';
import { saveAuthStateAction } from './../../../store/auth/auth.actions';
import { AuthValidator } from 'src/app/validators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends PageComponent {
    public validator = new AuthValidator();
    public form = this.validator.getLoginForm();

    /** Constructor */
    constructor(private _translate$: TranslateService, private _auth$: AuthService, private _toast$: AppToastService, private _router: Router) {
        super();
    }

    /**
     * On form submitted
     */
    public onSubmit() {
        this.form.clearControlErrorMessages();
        if (!this.form.valid || !this.helpers.isString(this.form.value.username) || !this.helpers.isString(this.form.value.password)) {
            this.form.setControlErrorMessages();
            return;
        }

        this._auth$.login(this.form.value.username, Md5.hashStr(this.form.value.password)).subscribe((result) => {
            if (!result.isSuccess || !result.data) {
                if (result.errors) {
                    this.form.setErrorMessagesFromValidationErrors(result.errors);
                    return;
                }

                const errMsg = this._translate$.instant(`message.${result.message}`) as string;
                this._toast$.error(errMsg);
                return;
            }

            this.store.dispatch(saveAuthStateAction({ payload: result.data }));

            const dashboardRoute = `${this.ROUTES.DASHBOARD}`;
            void this._router.navigate([dashboardRoute]);
        });
    }
}
