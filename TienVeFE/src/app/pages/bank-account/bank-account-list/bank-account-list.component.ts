import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { BankAccountDTO, BankDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService } from 'src/app/services';
import { ValueOf } from 'src/app/utils/types';
import { BankAccountSaveComponent } from '../bank-account-save/bank-account-save.component';
import { RadioModalComponent } from 'src/app/components/radio-modal/radio-modal.component';
import { Helpers } from 'src/app/utils';

@Component({
    selector: 'app-bank-account-list',
    templateUrl: './bank-account-list.component.html',
    styleUrls: ['./bank-account-list.component.scss'],
})
export class BankAccountListComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public searchForm = new FormGroup({
        keyword: new FormControl(''),
    });
    public status?: ValueOf<typeof this.CONSTANTS.BANK_ACCOUNT_STATUSES>;

    public bankList: BankDTO[] = [];

    public dataList: BankAccountDTO[] = [];
    public dataTotal = 0;

    public get isAllChecked() {
        return this.dataList.length > 0 ? this.dataList.every((item) => item.is_checked) : false;
    }

    constructor(private _bankAccount$: BankAccountService) {
        super();
    }

    ngOnInit() {
        this._getList();

        const sub = this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => this._getList());
        this._subscription.add(sub);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getList() {
        const sub = this._bankAccount$.getList({ keyword: this.searchForm.value.keyword || '', status: this.status, page: this.currentPage }).subscribe((res) => {
            this.isPageLoaded = true;

            this.dataTotal = res.data?.total || 0;
            this.dataList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public onCreate() {
        const modal = this.modal$.open(BankAccountSaveComponent, { size: 'lg', centered: true });
        const cmpIns = modal.componentInstance as BankAccountSaveComponent;
        const sub = cmpIns.resultEvent.subscribe(() => {
            this._getList();
        });
        this._subscription.add(sub);
    }

    public onViewDetail(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this.modal$.open(BankAccountSaveComponent, { size: 'lg', centered: true });
        const cmpIns = modal.componentInstance as BankAccountSaveComponent;
        cmpIns.id = this.dataList[idx].id;
        const sub = cmpIns.resultEvent.subscribe(() => {
            this._getList();
        });
        this._subscription.add(sub);
    }

    public onDelete(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const confirmDeleteMsg = String(this.translate$.instant('message.confirm_delete'));
        this.showConfirmModal(confirmDeleteMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._delete(idx);
            },
        });
    }

    private async _delete(idx: number) {
        const result = await this._bankAccount$.delete(this.dataList[idx].id);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this._getList();
    }

    public onPageChanged(page: number) {
        this.currentPage = page;
        this._getList();
    }

    public toggleAll() {
        const isAllChecked = this.isAllChecked;
        this.dataList = this.dataList.map((item) => ({ ...item, is_checked: !isAllChecked }));
    }

    public onFilter() {
        const allStatusId = 2;
        const modal = this.modal$.open(RadioModalComponent);
        const cmpIns = modal.componentInstance as RadioModalComponent;
        cmpIns.itemList = [
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED}`,
                label: 'Dừng kích hoạt',
                is_checked: this.status === this.CONSTANTS.BANK_ACCOUNT_STATUSES.DEACTIVATED,
            },
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED}`,
                label: 'Chưa kích hoạt',
                is_checked: this.status === this.CONSTANTS.BANK_ACCOUNT_STATUSES.NOT_ACTIVATED,
            },
            {
                id: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED}_${this.randomStr}`,
                value: `${this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED}`,
                label: 'Đang kích hoạt',
                is_checked: this.status === this.CONSTANTS.BANK_ACCOUNT_STATUSES.ACTIVATED,
            },
            {
                id: `${allStatusId}_${this.randomStr}`,
                value: `${allStatusId}`,
                label: String(this.translate$.instant('label.all')),
                is_checked: typeof this.status === 'undefined',
            },
        ];
        cmpIns.title = 'Lọc trạng thái tài khoản';
        cmpIns.message = String(this.translate$.instant('label.status'));
        const sub = cmpIns.confirmEvent.subscribe((val) => {
            const numVal = Number(val);
            if (numVal !== allStatusId) {
                this.status = numVal as ValueOf<typeof this.CONSTANTS.BANK_ACCOUNT_STATUSES>;
            } else {
                this.status = undefined;
            }

            this._getList();
        });
        this._subscription.add(sub);
    }

    public onDeleteMultiple() {
        const idList = this.dataList.filter((item) => item.is_checked && item.id).map((item) => item.id);
        if (!Helpers.isFilledArray(idList)) return;

        const confirmDeleteMsg = String(this.translate$.instant('message.confirm_delete'));
        this.showConfirmModal(confirmDeleteMsg, {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._deleteMultiple();
            },
        });
    }

    private async _deleteMultiple() {
        const idList = this.dataList.filter((item) => item.is_checked && item.id).map((item) => item.id);
        if (!Helpers.isFilledArray(idList)) return;

        const result = await this._bankAccount$.deleteMultiple(idList);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this._getList();
    }
}
