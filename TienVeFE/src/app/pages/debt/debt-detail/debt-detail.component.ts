import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime } from 'rxjs';
import { DateRangePickerModalComponent } from 'src/app/components/date-range-picker-modal/date-range-picker-modal.component';
import { BankAccountDTO, DebtDetailDTO, MessageDTO, MessageSearchQuery, SaveDebtDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, DebtService, MessageService } from 'src/app/services';
import { DebtValidator } from 'src/app/validators';
import { SendRemindMessageModalComponent } from '../send-remind-message-modal/send-remind-message-modal.component';

@Component({
    selector: 'app-debt-detail',
    templateUrl: './debt-detail.component.html',
    styleUrls: ['./debt-detail.component.scss'],
})
export class DebtDetailComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input({ required: true }) id = '';

    @Output() reloadParentList = new EventEmitter<void>();

    public viewMode: 'DETAIL' | 'UPDATE' | 'MESSAGE_LIST' | 'ADD_MESSAGE' = 'DETAIL';

    public validator = new DebtValidator();
    public updateForm = this.validator.getSaveForm();

    public bankAccountList: BankAccountDTO[] = [];

    public data = new DebtDetailDTO();

    public debtMsgList: MessageDTO[] = [];

    public userMsgSearchForm = new FormGroup({
        keyword: new FormControl(''),
    });
    private _userMsgStartDate: NgbDate | null = null;
    private _userMsgEndDate: NgbDate | null = null;

    public userMsgList: MessageDTO[] = [];

    public viewingUserMsg?: MessageDTO;

    public get isAllUserMgChecked() {
        return this.debtMsgList.length > 0 ? this.debtMsgList.every((item) => item.is_checked) : false;
    }

    constructor(public activeModal: NgbActiveModal, private _debt$: DebtService, private _message$: MessageService, private _bankAccount$: BankAccountService) {
        super();
    }

    ngOnInit() {
        this._getDebtMsgList();
        this._getUserMsgList();
        this._getBankAccountList();

        const sub = this.userMsgSearchForm.controls.keyword.valueChanges.pipe(debounceTime(500)).subscribe(() => this._getUserMsgList());
        this._subscription.add(sub);
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

        this.updateForm.controls.id.setValue(this.data.id);
        this.updateForm.controls.bank_account_id.setValue(this.data.bank_account_id);
        this.updateForm.controls.payer_name.setValue(this.data.payer_name);
        this.updateForm.controls.payer_phone.setValue(this.data.payer_phone);
        this.updateForm.controls.amount.setValue(this.data.amount);
        this.updateForm.controls.note.setValue(this.data.note);
        this.updateForm.disable();
    }

    public openDateRangePickerModal() {
        const modal = this.modal$.open(DateRangePickerModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as DateRangePickerModalComponent;
        cmpIns.title = 'Ngày nhận tin nhắn';
        cmpIns.startDate = this._userMsgStartDate;
        cmpIns.endDate = this._userMsgEndDate;
        const sub = cmpIns.confirmEvent.subscribe((value) => {
            this._userMsgStartDate = value.start;
            this._userMsgEndDate = value.end;
            this._getUserMsgList();
        });
        this._subscription.add(sub);
    }

    private _getDebtMsgList() {
        const sub = this._message$.getList({ page: -1, debt_id: this.id }).subscribe((res) => {
            this.debtMsgList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    private _getBankAccountList() {
        const sub = this._bankAccount$.getList({ page: -1 }).subscribe((res) => {
            this.bankAccountList =
                res.data?.list.map((acc) => {
                    acc.display_name = `${acc.bank_brand_name || ''} - ${acc.account_number}`;
                    return acc;
                }) || [];

            void this._getDetail();
        });
        this._subscription.add(sub);
    }

    public confirmRemoveMessage(msgIdx: number) {
        if (msgIdx < 0 || msgIdx >= this.debtMsgList.length) return;

        const confirmRemoveMsg = 'Bạn có chắc muốn xóa gạch nợ tin nhắn này ?';
        this.showConfirmModal(confirmRemoveMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._updateDebtId(this.debtMsgList[msgIdx].id);
            },
        });
    }

    public confirmAddMessage(userMsgIdx: number) {
        if (userMsgIdx < 0 || userMsgIdx >= this.userMsgList.length) return;

        const confirmRemoveMsg = 'Bạn có chắc muốn thêm tin nhắn này ?';
        this.showConfirmModal(confirmRemoveMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._updateDebtId(this.userMsgList[userMsgIdx].id, this.id);
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

        this.reloadParentList.next();

        await this._getDetail();
        this._getUserMsgList();
        this._getDebtMsgList();
    }

    public openSendMessageModal() {
        const modal = this.modal$.open(SendRemindMessageModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as SendRemindMessageModalComponent;
        cmpIns.shouldShowOptions = false;
        cmpIns.checkedList = [this.data];
        const sub = cmpIns.resultEvent.subscribe(() => this.reloadParentList.emit());
        this._subscription.add(sub);
    }

    public toggleAllUserMsg() {
        const isAllChecked = this.isAllUserMgChecked;
        this.debtMsgList = this.debtMsgList.map((item) => ({ ...item, is_checked: !isAllChecked }));
    }

    public switchMode(mode: typeof this.viewMode) {
        this.viewMode = mode;

        if (this.viewMode === 'UPDATE') {
            this.updateForm.controls.bank_account_id.enable();
            this.updateForm.controls.payer_name.enable();
            this.updateForm.controls.payer_phone.enable();
            this.updateForm.controls.amount.enable();
            this.updateForm.controls.note.enable();
        } else {
            this.updateForm.disable();
        }

        if (this.viewMode === 'ADD_MESSAGE') {
            this._getUserMsgList();
        }
    }

    private _getUserMsgList() {
        const params: MessageSearchQuery = { page: -1, receive_user_id: this.currentUser.id };
        const formValue = this.userMsgSearchForm.value;

        if (this.helpers.isString(formValue.keyword)) {
            params.keyword = formValue.keyword;
        }
        if (this._userMsgStartDate) {
            params.start_date = `${this._userMsgStartDate.year}-${this._userMsgStartDate.month < 10 ? `0${this._userMsgStartDate.month}` : this._userMsgStartDate.month}-${this._userMsgStartDate.day}`;
        }
        if (this._userMsgEndDate) {
            params.end_date = `${this._userMsgEndDate.year}-${this._userMsgEndDate.month < 10 ? `0${this._userMsgEndDate.month}` : this._userMsgEndDate.month}-${this._userMsgEndDate.day}`;
        }
        const sub = this._message$.getList(params).subscribe((res) => {
            this.userMsgList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public viewUserMsg(idx: number) {
        if (idx < 0 || idx >= this.userMsgList.length) return;

        this.viewingUserMsg = this.userMsgList[idx];
    }

    public async onSubmitUpdate() {
        this.updateForm.clearControlErrorMessages();
        if (!this.updateForm.valid) {
            this.updateForm.setControlErrorMessages();
            return;
        }

        const formValue = this.updateForm.value;
        const data = new SaveDebtDTO();
        data.id = this.data.id || '';
        data.bank_account_id = formValue.bank_account_id || 0;
        data.payer_name = formValue.payer_name || '';
        data.payer_phone = formValue.payer_phone || '';
        data.amount = formValue.amount || 0;
        data.note = formValue.note || '';

        const result = await this._debt$.update(data);
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.reloadParentList.emit();

        await this._getDetail();

        this.switchMode('DETAIL');
    }
}
