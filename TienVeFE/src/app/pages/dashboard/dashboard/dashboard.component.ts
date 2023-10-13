import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { RadioModalComponent } from 'src/app/components/radio-modal/radio-modal.component';
import { BankAccountDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService } from 'src/app/services';
import { ValueOf } from 'src/app/utils/types';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public bankAccSearchForm = new FormGroup({
        keyword: new FormControl(''),
    });
    public bankAccStatus?: ValueOf<typeof this.CONSTANTS.BANK_ACCOUNT_STATUSES>;

    public bankAccDataList: BankAccountDTO[] = [];
    public bankAccDataTotal = 0;
    public selectedBankAccount = new BankAccountDTO();

    constructor(private _bankAccount$: BankAccountService) {
        super();
    }

    ngOnInit() {
        this._getBankAccList();

        const sub = this.bankAccSearchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => this._getBankAccList());
        this._subscription.add(sub);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getBankAccList() {
        const sub = this._bankAccount$.getList({ keyword: this.bankAccSearchForm.value.keyword || '', status: this.bankAccStatus, page: this.currentPage }).subscribe((res) => {
            this.isPageLoaded = true;

            this.bankAccDataTotal = res.data?.total || 0;
            this.bankAccDataList = res.data?.list || [];

            if (this.helpers.isFilledArray(this.bankAccDataList)) {
                this.selectedBankAccount = this.bankAccDataList[0];
            }
        });
        this._subscription.add(sub);
    }

    public onBankAccPageChanged(page: number) {
        this.currentPage = page;
        this._getBankAccList();
    }

    public onFilterBankAcc() {
        const allStatusId = 2;
        const modal = this.modal$.open(RadioModalComponent, { centered: true, size: 'sm' });
        const cmpIns = modal.componentInstance as RadioModalComponent;
        cmpIns.itemList = [
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED}`,
                label: 'Dừng kích hoạt',
                is_checked: this.bankAccStatus === this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED,
            },
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED}`,
                label: 'Chưa kích hoạt',
                is_checked: this.bankAccStatus === this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED,
            },
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED}`,
                label: 'Đang kích hoạt',
                is_checked: this.bankAccStatus === this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED,
            },
            {
                id: `${allStatusId}_${this.randomStr}`,
                value: `${allStatusId}`,
                label: String(this.translate$.instant('label.all')),
                is_checked: typeof this.bankAccStatus === 'undefined',
            },
        ];
        cmpIns.title = 'Lọc trạng thái tài khoản';
        cmpIns.message = String(this.translate$.instant('label.status'));
        const sub = cmpIns.confirmEvent.subscribe((val) => {
            const numVal = Number(val);
            if (numVal !== allStatusId) {
                this.bankAccStatus = numVal as ValueOf<typeof this.CONSTANTS.BANK_ACCOUNT_STATUSES>;
            } else {
                this.bankAccStatus = undefined;
            }

            this._getBankAccList();
        });
        this._subscription.add(sub);
    }

    public selectBankAccount(idx: number) {
        if (idx < 0 || idx >= this.bankAccDataList.length) return;
        this.selectedBankAccount = this.bankAccDataList[idx];
    }
}
