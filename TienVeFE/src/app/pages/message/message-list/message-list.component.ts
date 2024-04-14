import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime } from 'rxjs';
import { DateRangePickerModalComponent } from 'src/app/components/date-range-picker-modal/date-range-picker-modal.component';
import { SelectInputModalComponent } from 'src/app/components/select-input-modal/select-input-modal.component';
import { BankAccountDTO, MessageDTO, MessageSearchQuery } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { AccountNumberPipe } from 'src/app/pipes/account-number.pipe';
import { BankAccountService, MessageService } from 'src/app/services';
import * as XLSX from 'xlsx';
import { MessageDetailComponent } from '../message-detail/message-detail.component';
import { Helpers } from 'src/app/utils';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public searchForm = new FormGroup({
        keyword: new FormControl(''),
    });
    private _startDate: NgbDate | null = null;
    private _endDate: NgbDate | null = null;

    public bankAccountNumber?: string;
    public bankAccDataList: BankAccountDTO[] = [];

    public dataList: MessageDTO[] = [];
    public dataTotal = 0;

    public get isAllChecked() {
        return this.dataList.length > 0 ? this.dataList.every((item) => item.is_checked) : false;
    }

    constructor(private _message$: MessageService, private _bankAccount$: BankAccountService, private _accountNumberPipe: AccountNumberPipe) {
        super();
    }

    ngOnInit() {
        this._getList();
        this._getBankAccList();

        const sub = this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => this._getList());
        this._subscription.add(sub);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getBankAccList() {
        const sub = this._bankAccount$.getList({ page: -1, include_deleted: true, group_by_account_number: true }).subscribe((res) => {
            this.isPageLoaded = true;

            this.bankAccDataList =
                res.data?.list.map((acc) => {
                    acc.display_name = `${acc.bank_brand_name || ''} - ${String(this._accountNumberPipe.transform(acc.account_number))}`;
                    return acc;
                }) || [];
        });
        this._subscription.add(sub);
    }

    private _createSearchParams() {
        const params: MessageSearchQuery = {
            page: this.currentPage,
        };
        const formValue = this.searchForm.value;

        if (this.helpers.isString(formValue.keyword)) {
            params.keyword = formValue.keyword;
        }
        if (this._startDate) {
            params.start_date = `${this._startDate.year}-${this._startDate.month < 10 ? `0${this._startDate.month}` : this._startDate.month}-${this._startDate.day}`;
        }
        if (this._endDate) {
            params.end_date = `${this._endDate.year}-${this._endDate.month < 10 ? `0${this._endDate.month}` : this._endDate.month}-${this._endDate.day}`;
        }
        params.bank_account_number = this.bankAccountNumber;
        return params;
    }

    private _getList() {
        const params = this._createSearchParams();
        const sub = this._message$.getList(params).subscribe((res) => {
            this.isPageLoaded = true;
            this.dataTotal = res.data?.total || 0;
            this.dataList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public openDateRangePickerModal() {
        const modal = this.modal$.open(DateRangePickerModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as DateRangePickerModalComponent;
        cmpIns.title = 'Ngày nhận tin nhắn';
        cmpIns.startDate = this._startDate;
        cmpIns.endDate = this._endDate;
        const sub = cmpIns.confirmEvent.subscribe((value) => {
            this._startDate = value.start;
            this._endDate = value.end;
            this._getList();
        });
        this._subscription.add(sub);
    }

    public toggleAll() {
        const isAllChecked = this.isAllChecked;
        this.dataList = this.dataList.map((item) => ({ ...item, is_checked: !isAllChecked }));
    }

    public onDeleteMultiple() {
        const idList = this.dataList.filter((item) => item.is_checked && item.id).map((item) => item.id);
        if (!this.helpers.isFilledArray(idList)) return;

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
        if (!this.helpers.isFilledArray(idList)) return;

        const result = await this._message$.deleteMultiple(idList);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this._getList();
    }

    public viewDetail(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this.modal$.open(MessageDetailComponent, { centered: true });
        const cmpIns = modal.componentInstance as MessageDetailComponent;
        cmpIns.id = this.dataList[idx].id;
    }

    public onPageChanged(page: number) {
        this.currentPage = page;
        this._getList();
    }

    public onFilterBankAccount() {
        const modal = this.modal$.open(SelectInputModalComponent, { centered: true, size: 'md' });
        const cmpIns = modal.componentInstance as SelectInputModalComponent;
        cmpIns.itemList = this.bankAccDataList.map((acc) => ({ id: acc.account_number, label: acc.display_name || '' }));
        cmpIns.title = 'Lọc tài khoản ngân hàng';
        cmpIns.message = 'Chọn tài khoản ngân hàng';
        cmpIns.selectedId = this.bankAccountNumber;
        cmpIns.confirmEvent.subscribe((accNumber) => {
            this.bankAccountNumber = Helpers.isString(accNumber) ? accNumber : undefined;
            this._getList();
        });
    }

    public onExportExcel() {
        const params = this._createSearchParams();
        const sub = this._message$.getList({ ...params, page: -1 }).subscribe((res) => {
            if (!res.isSuccess || !res.data || !this.helpers.isFilledArray(res.data.list)) {
                const errMsg = String(this.translate$.instant(`message.${res.message}`));
                this.toast$.error(errMsg);
                return;
            }

            const excelDataList = res.data.list.map((item) => [
                item.created_date,
                item.bank_brand_name,
                this._accountNumberPipe.transform(item.bank_account_number),
                item.debt_id,
                this.helpers.isString(item.debt_id) ? 'Hoàn thành' : 'Không tìm thấy ID',
            ]);
            const data = [['Ngày giao dịch', 'Ngân hàng', 'Số tài khoản', 'Mã công nợ', 'Match nội dung'], ...excelDataList];
            const worksheet = XLSX.utils.aoa_to_sheet(data);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách');

            const outputFileName = `${this.CONSTANTS.EXCEL_FILE_NAME.MESSAGE_LIST}.xlsx`;

            XLSX.writeFile(workbook, outputFileName);

            const successMsg = String(this.translate$.instant('message.export_file_successfully'));
            this.toast$.success(successMsg);
        });
        this._subscription.add(sub);
    }
}
