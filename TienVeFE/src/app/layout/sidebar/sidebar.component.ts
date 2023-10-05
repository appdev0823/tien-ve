import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as jQuery from 'jquery';
import { UpgradeModalComponent } from 'src/app/components/upgrade-modal/upgrade-modal.component';
import BaseComponent from 'src/app/includes/base.component';

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

    public collapseSidebar() {
        setTimeout(() => {
            const sidebar = jQuery('.sidebar-mini');
            if (sidebar?.hasClass('sidebar-open')) {
                sidebar.removeClass('sidebar-open');
                sidebar.addClass('sidebar-closed sidebar-collapse');
            }
        }, 100);
    }

    public openUpgradeModal() {
        this.modal$.open(UpgradeModalComponent, { centered: true });
    }
}
