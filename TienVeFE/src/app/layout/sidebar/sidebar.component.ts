import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import BaseComponent from 'src/app/includes/base.component';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import * as jQuery from 'jquery';
import { LoginUserDTO } from 'src/app/dtos';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends BaseComponent implements OnInit {
    public routePathList: string[] = [];

    /** Constructor */
    constructor(private readonly _router: Router) {
        super();
    }

    /** @returns */
    ngOnInit() {
        const url = this.helpers.removeSubstringStartingWith(this._router.url, '?');
        if (this.helpers.isString(url)) {
            // the first path splitted from url is always blank
            this.routePathList = url.split('/').slice(1) || [];
        }

        this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routePathList = event.url.split('/').slice(1) || [];
            }
        });
    }

    public async logOut() {
        this.store.dispatch(saveAuthStateAction({ payload: new LoginUserDTO() }));
        localStorage.removeItem(this.CONSTANTS.LS_ACCESS_TOKEN_KEY);
        const loginRoute = `/${this.ROUTES.AUTH.MODULE}/${this.ROUTES.AUTH.LOGIN}`;
        await this._router.navigate([loginRoute]);
    }

    public collapseSidebar() {
        setTimeout(() => {
            const sidebar = jQuery('.sidebar-mini');
            if (sidebar?.hasClass('sidebar-open')) {
                sidebar.removeClass('sidebar-open');
                sidebar.addClass('sidebar-closed sidebar-collapse');
            }
        }, 100);
    }
}
