import { Component, HostListener } from '@angular/core';
import PageComponent from './includes/page.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent extends PageComponent {
    title = 'Tiền Về';

    /** Constructor */
    constructor() {
        super();
    }

    /**
     * Show error message when user is offline
     */
    @HostListener('window:offline', ['$event'])
    showOfflineMsg() {
        const msg = String(this.translate$.instant('message.offline'));
        this.toast$.error(msg);
    }

    /**
     * Show message when user is online
     */
    @HostListener('window:online', ['$event'])
    showOnLineMsg() {
        const msg = String(this.translate$.instant('message.online'));
        this.toast$.info(msg);
    }
}
