import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import BaseComponent from 'src/app/includes/base.component';
import { SettingService } from 'src/app/services';
import { Helpers } from 'src/app/utils';

@Component({
    selector: 'app-upgrade-modal',
    templateUrl: './upgrade-modal.component.html',
    styleUrls: ['./upgrade-modal.component.scss'],
})
export class UpgradeModalComponent extends BaseComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public upgradeNote = '';

    constructor(public activeModal: NgbActiveModal, private _setting$: SettingService) {
        super();
    }

    ngOnInit() {
        this._getUpgradeNote();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getUpgradeNote() {
        const sub = this._setting$.getListByFieldNameList([this.CONSTANTS.SETTING_FIELD_NAMES.UPGRADE_NOTE]).subscribe((result) => {
            if (result.isSuccess && result.data && Helpers.isFilledArray(result.data.list)) {
                this.upgradeNote = result.data.list[0].value;
            }
        });
        this._subscription.add(sub);
    }
}
