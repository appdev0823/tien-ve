import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BankAccountDTO, BankDTO, SaveBankAccountDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, BankService } from 'src/app/services';
import { ViewMode } from 'src/app/utils/types';
import { BankAccountValidator } from 'src/app/validators';

@Component({
    selector: 'app-bank-account-save',
    templateUrl: './bank-account-save.component.html',
    styleUrls: ['./bank-account-save.component.scss'],
})
export class BankAccountSaveComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input() id = 0;

    public viewMode: ViewMode | 'CONFIRM_CREATE' | 'COMPLETE_CREATE' = 'VIEW';

    public validator = new BankAccountValidator();
    public form = this.validator.getSaveForm();

    public bankList: BankDTO[] = [];
    public data = new BankAccountDTO();

    public selectedBank?: BankDTO;

    public resultEvent = new EventEmitter<void>();

    constructor(public activeModal: NgbActiveModal, private _bankAccount$: BankAccountService, private _bank$: BankService) {
        super();
    }

    ngOnInit() {
        this._getBankList();
        if (this.id) {
            this.viewMode = 'VIEW';
            void this._getDetail();
        } else {
            this.viewMode = 'CREATE';
            this.form.controls.phone.setValue(this.currentUser.phone);
        }

    //! @Đỗ Văn Khả oksy thế chốt để default số này nhé, cc @Lưu Tuấn Nguyên
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getBankList() {
        const sub = this._bank$.getList().subscribe((res) => {
            this.bankList = res.data?.list.map((bank) => ({ ...bank, name: `${bank.brand_name} - ${bank.name}` })) || [];
        });
        this._subscription.add(sub);
    }

    private async _getDetail() {
        const result = await this._bankAccount$.getDetail(this.id);
        this.isPageLoaded = true;
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        this.data = result.data;

        this.form.controls.bank_id.setValue(this.data.bank_id);
        this.form.controls.branch_name.setValue(this.data.branch_name);
        this.form.controls.account_number.setValue(this.data.account_number);
        this.form.controls.card_owner.setValue(this.data.card_owner);
        this.form.controls.phone.setValue(this.data.phone);
        this.form.controls.name.setValue(this.data.name);
        this.form.controls.status.setValue(this.data.status);

        if (this.viewMode === 'VIEW') {
            this.form.controls.status.disable();
        }
    }

    public onBankChanged() {
        const bankId = this.form.value.bank_id;
        this.selectedBank = this.bankList.find((item) => item.id === bankId);
    }

    public onConfirmCreate() {
        this.form.clearControlErrorMessages();
        if (!this.form.valid) {
            this.form.setControlErrorMessages();
            return;
        }

        this.switchMode('CONFIRM_CREATE');
    }

    public async onCreate() {
        const params = new SaveBankAccountDTO();
        params.bank_id = this.form.value.bank_id || 0;
        params.phone = this.form.value.phone || '';
        params.branch_name = this.form.value.branch_name || '';
        params.card_owner = this.form.value.card_owner || '';
        params.account_number = this.form.value.account_number || '';
        params.name = this.form.value.name || '';
        params.status = this.form.value.status || this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED;

        const result = await this._bankAccount$.create(params);
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.data = result.data;
        this.resultEvent.emit();
        this.switchMode('COMPLETE_CREATE');
    }

    public async onUpdate() {
        if (!this.id || !this.data.id) return;
        this.form.clearControlErrorMessages();
        if (!this.form.valid) {
            this.form.setControlErrorMessages();
            return;
        }

        const params = new SaveBankAccountDTO();
        params.id = this.id;
        params.bank_id = this.form.value.bank_id || 0;
        params.phone = this.form.value.phone || '';
        params.branch_name = this.form.value.branch_name || '';
        params.card_owner = this.form.value.card_owner || '';
        params.account_number = this.form.value.account_number || '';
        params.name = this.form.value.name || '';
        params.status = this.form.value.status || this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED;

        const result = await this._bankAccount$.update(params);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.activeModal.close();
        this.resultEvent.emit();
    }

    public onDelete() {
        if (!this.data.id) return;

        const confirmDeleteMsg = String(this.translate$.instant('message.confirm_delete'));
        this.showConfirmModal(confirmDeleteMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._delete();
            },
        });
    }

    private async _delete() {
        const result = await this._bankAccount$.delete(this.data.id);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this.resultEvent.emit();
        this.activeModal.close();
    }

    public switchMode(mode: typeof this.viewMode) {
        this.viewMode = mode;

        if (this.viewMode !== 'VIEW') {
            this.form.controls.status.enable();
        } else {
            this.form.controls.status.disable();
        }

        if (this.viewMode === 'CREATE') {
            this.form.enable();
        }

        if (this.viewMode === 'CONFIRM_CREATE') {
            this.form.disable();
        }
    }
}
