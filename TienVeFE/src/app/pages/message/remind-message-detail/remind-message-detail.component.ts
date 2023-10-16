import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RemindMessageDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { RemindMessageService } from 'src/app/services';

@Component({
    selector: 'app-remind-message-detail',
    templateUrl: './remind-message-detail.component.html',
    styleUrls: ['./remind-message-detail.component.scss'],
})
export class RemindMessageDetailComponent extends PageComponent implements OnInit {
    @Input({ required: true }) id = 0;

    public data = new RemindMessageDTO();

    constructor(public activeModal: NgbActiveModal, private _remindMessage$: RemindMessageService) {
        super();
    }

    ngOnInit() {
        void this._getDetail();
    }

    public async _getDetail() {
        const result = await this._remindMessage$.getDetail(this.id);
        this.isPageLoaded = true;
        if (!result.isSuccess || !result.data) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        this.data = result.data;
    }
}
