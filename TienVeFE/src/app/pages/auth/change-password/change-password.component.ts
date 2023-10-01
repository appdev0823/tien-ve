import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginUserDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { AuthService } from 'src/app/services';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import { AuthValidator } from 'src/app/validators';
import { Md5 } from 'ts-md5';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends PageComponent implements OnDestroy {
    private _subscription = new Subscription();

    public validator = new AuthValidator();
    public form = this.validator.getChangePasswordForm();

    constructor(private _auth$: AuthService, private _router: Router) {
        super();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public onSubmit() {
        this.form.clearControlErrorMessages();
        if (this.form.invalid) {
            this.form.setControlErrorMessages();
            return;
        }

        const hashedOldPassword = Md5.hashStr(this.form.value.old_password || '');
        const hashedNewPassword = Md5.hashStr(this.form.value.new_password || '');

        const sub = this._auth$.changePassword(hashedOldPassword, hashedNewPassword).subscribe((result) => {
            if (!result.isSuccess) {
                if (result.errors) {
                    this.form.setErrorMessagesFromValidationErrors(result.errors);
                    return;
                }

                const errMsg = this.translate$.instant(`message.${result.message}`) as string;
                this.toast$.error(errMsg);
                return;
            }

            const successMsg = String(this.translate$.instant('message.save_successfully'));
            this.toast$.success(successMsg);

            this.store.dispatch(saveAuthStateAction({ payload: new LoginUserDTO() }));
            localStorage.removeItem(this.CONSTANTS.LS_ACCESS_TOKEN_KEY);
            const loginRoute = `/${this.ROUTES.AUTH.MODULE}/${this.ROUTES.AUTH.LOGIN}`;
            void this._router.navigate([loginRoute]);
        });
        this._subscription.add(sub);
    }
}
