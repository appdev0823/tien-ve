import { Component, HostListener } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppToastService } from './components/app-toast/app-toast.service';
import { MDateParserFormatter } from './components/datepicker/date-parser-formatter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [{ provide: NgbDateParserFormatter, useClass: MDateParserFormatter }],
})
export class AppComponent {
    title = 'Tiền Về';

    /** Constructor */
    constructor(private _toast$: AppToastService, private _translate$: TranslateService) {}

    /**
     * Show error message when user is offline
     */
    @HostListener('window:offline', ['$event'])
    showOfflineMsg() {
        const msg = String(this._translate$.instant('message.offline'));
        this._toast$.error(msg);
    }

    /**
     * Show message when user is online
     */
    @HostListener('window:online', ['$event'])
    showOnLineMsg() {
        const msg = String(this._translate$.instant('message.online'));
        this._toast$.info(msg);
    }
}
