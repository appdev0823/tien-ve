import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MessageDTO, MessageSearchQuery } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { DebtService, MessageService } from 'src/app/services';

@Component({
    selector: 'app-message-select',
    templateUrl: './message-select.component.html',
})
export class MessageSelectComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input() debtId = '';
    @Input() searchQuery: MessageSearchQuery = {};

    @Output() messageSelected = new EventEmitter<MessageDTO>();

    public dataList: MessageDTO[] = [];
    public dataTotal = 0;

    constructor(public activeModal: NgbActiveModal, private _debt$: DebtService, private _message$: MessageService) {
        super();
    }

    ngOnInit() {
        this._getList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getList() {
        const sub = this._message$.getList({ ...this.searchQuery, page: this.currentPage }).subscribe((res) => {
            this.dataList = res.data?.list || [];
            this.dataTotal = res.data?.total || 0;
        });
        this._subscription.add(sub);
    }

    public confirmSelectMsg(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const confirmAddMessage = `Bạn có chắc chọn tin nhắn này để gạch nợ cho công nợ ${this.debtId} ?`;
        this.showConfirmModal(confirmAddMessage, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                this.messageSelected.emit(this.dataList[idx]);
                this.activeModal.close();
            },
        });
    }

    public onPageChanged(page: number) {
        this.currentPage = page;
        this._getList();
    }
}
