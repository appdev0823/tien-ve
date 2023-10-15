import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { MessageService } from 'src/app/services';

@Component({
    selector: 'app-message-detail',
    templateUrl: './message-detail.component.html',
    styleUrls: ['./message-detail.component.scss'],
})
export class MessageDetailComponent extends PageComponent implements OnInit {
    @Input({ required: true }) id = 0;

    public data = new MessageDTO();

    constructor(public activeModal: NgbActiveModal, private _message$: MessageService) {
        super();
    }

    ngOnInit() {
        void this._getDetail();
    }

    public async _getDetail() {
        const result = await this._message$.getDetail(this.id);
        this.isPageLoaded = true;
        if (!result.isSuccess || !result.data) {
            const errMsg = this.translate$.instant(`message.${result.message}`) as string;
            this.toast$.error(errMsg);
            return;
        }

        this.data = result.data;
    }
}
