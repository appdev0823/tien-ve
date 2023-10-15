import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { BankAccountDTO, SaveDebtDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, DebtService, UserService } from 'src/app/services';
import { DebtValidator } from 'src/app/validators';

@Component({
    selector: 'app-debt-create',
    templateUrl: './debt-create.component.html',
    styleUrls: ['./debt-create.component.scss'],
})
export class DebtCreateComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public validator = new DebtValidator();
    public form = this.validator.getSaveForm();

    public bankAccountList: BankAccountDTO[] = [];

    @Output() resultEvent = new EventEmitter<void>();

    constructor(public activeModal: NgbActiveModal, private _user$: UserService, private _bankAccount$: BankAccountService, private _debt$: DebtService) {
        super();
    }

    ngOnInit() {
        void this._generateId();
        this._getBankAccountList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private async _generateId() {
        const result = await this._user$.getTodayDebtCount();
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const { PREFIX, SEPARATOR, DATE_FORMAT, USER_ID_LENGTH, AUTO_INCREMENT_LENGTH } = this.CONSTANTS.DEBT_ID_FORMAT;
        const curDateStr = dayjs(new Date()).format(DATE_FORMAT);
        const paddedUserId = this.helpers.padLeft(this.currentUser.id, USER_ID_LENGTH);
        const idLeftPartStr = `${PREFIX}${SEPARATOR}${curDateStr}${SEPARATOR}${paddedUserId}${SEPARATOR}`; // TV-DDMMYY-0000X-
        const todayDebtCount = Number(result.data.count) || 0;
        this.form.controls.id.setValue(`${idLeftPartStr}${this.helpers.padLeft(todayDebtCount + 1, AUTO_INCREMENT_LENGTH)}`);
    }

    private _getBankAccountList() {
        const sub = this._bankAccount$.getList({ page: -1 }).subscribe((res) => {
            this.isPageLoaded = true;
            this.bankAccountList =
                res.data?.list.map((acc) => {
                    acc.display_name = `${acc.bank_brand_name || ''} - ${acc.account_number}`;
                    return acc;
                }) || [];
        });
        this._subscription.add(sub);
    }

    public async onSubmit() {
        this.form.clearControlErrorMessages();
        if (!this.form.valid) {
            this.form.setControlErrorMessages();
            return;
        }

        const formValue = this.form.value;
        const data = new SaveDebtDTO();
        data.id = formValue.id || '';
        data.bank_account_id = formValue.bank_account_id || 0;
        data.payer_name = formValue.payer_name || '';
        data.payer_phone = formValue.payer_phone || '';
        data.amount = formValue.amount || 0;
        data.note = formValue.note || '';

        const result = await this._debt$.createMultiple([data]);
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.resultEvent.emit();
        this.activeModal.close();
    }
}
