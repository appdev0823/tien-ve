import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import BaseComponent from 'src/app/includes/base.component';
import { SettingService } from 'src/app/services';

@Component({
    selector: 'app-download-app-modal',
    templateUrl: './download-app-modal.component.html',
    styleUrls: ['./download-app-modal.component.scss'],
})
export class DownloadAppModalComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public appLink = '';

    constructor(public activeModal: NgbActiveModal, private _setting$: SettingService) {
        super();
    }

    ngOnInit() {
        this._getAppLink();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getAppLink() {
        const sub = this._setting$.getListByFieldNameList([this.CONSTANTS.SETTING_FIELD_NAMES.APP_LINK]).subscribe((result) => {
            if (result.isSuccess && result.data && this.helpers.isFilledArray(result.data.list)) {
                this.appLink = result.data.list[0].value;
            }
        });
        this._subscription.add(sub);
    }
}
