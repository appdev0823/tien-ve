import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUserDTO } from 'src/app/dtos';
import BaseComponent from 'src/app/includes/base.component';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import * as jQuery from 'jquery';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent {
    private _isActionDropdownShowing = false;

    /** Constructor */
    constructor(private readonly _router: Router) {
        super();
    }

    public async logOut() {
        this.store.dispatch(saveAuthStateAction({ payload: new LoginUserDTO() }));
        localStorage.removeItem(this.CONSTANTS.LS_ACCESS_TOKEN_KEY);
        const loginRoute = `/${this.ROUTES.AUTH.MODULE}/${this.ROUTES.AUTH.LOGIN}`;
        await this._router.navigate([loginRoute]);
    }

    public toggleActionDropdown() {
        this._isActionDropdownShowing = !this._isActionDropdownShowing;

        if (this._isActionDropdownShowing) {
            jQuery('#actionDropdown').slideDown(100);
        } else {
            jQuery('#actionDropdown').slideUp(100);
        }
    }
}
