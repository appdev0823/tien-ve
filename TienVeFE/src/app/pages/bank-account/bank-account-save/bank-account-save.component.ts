import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import { BankAccountDTO, BankDTO, SaveBankAccountDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, BankService } from 'src/app/services';
import { BankAccountValidator } from 'src/app/validators';

@Component({
    selector: 'app-bank-account-save',
    templateUrl: './bank-account-save.component.html',
    styleUrls: ['./bank-account-save.component.scss'],
})
export class BankAccountSaveComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    @Input() id = 0;

    public validator = new BankAccountValidator();
    public form = this.validator.getSaveForm();

    public bankList: BankDTO[] = [];
    public data = new BankAccountDTO();

    public resultEvent = new EventEmitter<void>();

    constructor(public activeModal: NgbActiveModal, private _translate$: TranslateService, private _toast$: AppToastService, private _bankAccount$: BankAccountService, private _bank$: BankService) {
        super();
    }

    ngOnInit() {
        this._getBankList();
        if (this.id) {
            void this._getDetail();
        } else {
            this.form.controls.phone.setValue(this.currentUser.phone);
        }
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
            const errMsg = String(this._translate$.instant(`message.${result.message}`));
            this._toast$.error(errMsg);
            return;
        }

        this.data = result.data;

        this.form.controls.bank_id.setValue(this.data.bank_id);
        this.form.controls.branch_name.setValue(this.data.branch_name);
        this.form.controls.account_number.setValue(this.data.account_number);
        this.form.controls.card_owner.setValue(this.data.card_owner);
        this.form.controls.phone.setValue(this.data.phone);
        this.form.controls.name.setValue(this.data.name);
    }

    public async onSubmit() {
        this.form.clearControlErrorMessages();
        if (!this.form.valid) {
            this.form.setControlErrorMessages();
            return;
        }

        const params = new SaveBankAccountDTO();
        if (this.id) params.id = this.id;
        params.bank_id = this.form.value.bank_id || 0;
        params.phone = this.form.value.phone || '';
        params.branch_name = this.form.value.branch_name || '';
        params.card_owner = this.form.value.card_owner || '';
        params.account_number = this.form.value.account_number || '';
        params.name = this.form.value.name || '';

        if (this.id && this.data.id) {
            const result = await this._bankAccount$.update(params);
            if (!result.isSuccess) {
                const errMsg = String(this._translate$.instant(`message.${result.message}`));
                this._toast$.error(errMsg);
                return;
            }
        } else {
            const result = await this._bankAccount$.create(params);
            if (!result.isSuccess) {
                const errMsg = String(this._translate$.instant(`message.${result.message}`));
                this._toast$.error(errMsg);
                return;
            }
        }

        const successMsg = String(this._translate$.instant('message.save_successfully'));
        this._toast$.success(successMsg);

        this.activeModal.close();
        this.resultEvent.emit();
    }
}
