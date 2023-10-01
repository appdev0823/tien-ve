import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import { MessageSelectComponent } from 'src/app/components/message-select/message-select.component';
import { MessageDTO } from 'src/app/dtos';
import { DebtDetailDTO } from 'src/app/dtos/debt.dto';
import PageComponent from 'src/app/includes/page.component';
import { DebtService, MessageService } from 'src/app/services';

@Component({
    selector: 'app-debt-detail',
    templateUrl: './debt-detail.component.html',
    styleUrls: ['./debt-detail.component.scss'],
})
export class DebtDetailComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input() id = '';

    @Output() reloadParentList = new EventEmitter<void>();

    public data = new DebtDetailDTO();

    public messageList: MessageDTO[] = [];

    constructor(public activeModal: NgbActiveModal, private _debt$: DebtService, private _message$: MessageService) {
        super();
    }

    ngOnInit() {
        void this._getDetail();
        this._getMessageList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private async _getDetail() {
        const result = await this._debt$.getDetail(this.id);
        this.isPageLoaded = true;
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        this.data = result.data;
    }

    private _getMessageList() {
        const sub = this._message$.getList({ page: -1, debt_id: this.id }).subscribe((res) => {
            this.messageList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public confirmRemoveMessage(idx: number) {
        if (idx < 0 || idx >= this.messageList.length) return;

        const confirmRemoveMsg = 'Bạn có chắc muốn xóa gạch nợ tin nhắn này ?';
        this.showConfirmModal(confirmRemoveMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._updateDebtId(this.messageList[idx].id);
            },
        });
    }

    private async _updateDebtId(messageId: number, debtId?: string) {
        const result = await this._message$.updateDebtId(messageId, debtId);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.reloadParentList.emit();

        await this._getDetail();
        this._getMessageList();
    }

    public addMessage() {
        const modal = this.modal$.open(MessageSelectComponent, { centered: true, size: 'lg' });
        const cmpIns = modal.componentInstance as MessageSelectComponent;
        cmpIns.debtId = this.id;
        cmpIns.searchQuery = {
            receive_user_id: this.currentUser.id,
        };
        cmpIns.messageSelected.subscribe((message) => {
            void this._updateDebtId(message.id, this.id);
        });
    }
}
