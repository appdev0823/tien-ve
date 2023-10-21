import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime, map } from 'rxjs';
import { DateRangePickerModalComponent } from 'src/app/components/date-range-picker-modal/date-range-picker-modal.component';
import { DebtDTO, DebtPaidStatus, DebtSearchQuery } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { DebtService } from 'src/app/services';
import { DebtDetailComponent } from '../debt-detail/debt-detail.component';
import { RadioModalComponent } from 'src/app/components/radio-modal/radio-modal.component';
import { SendRemindMessageModalComponent } from '../send-remind-message-modal/send-remind-message-modal.component';
import * as XLSX from 'xlsx';
import { DebtCreateComponent } from '../debt-create/debt-create.component';

@Component({
    selector: 'app-debt-list',
    templateUrl: './debt-list.component.html',
    styleUrls: ['./debt-list.component.scss'],
})
export class DebtListComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public searchForm = new FormGroup({
        keyword: new FormControl(''),
    });
    private _startDate: NgbDate | null = null;
    private _endDate: NgbDate | null = null;
    private _paidStatus: DebtPaidStatus = 'ALL';

    public dataList: DebtDTO[] = [];
    public dataTotal = 0;

    public get isAllChecked() {
        return this.dataList.length > 0 ? this.dataList.every((item) => item.is_checked) : false;
    }

    constructor(private _debt$: DebtService) {
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

    private _createSearchParams() {
        const params: DebtSearchQuery = {};
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
        params.is_not_paid = undefined;
        params.is_paid = undefined;
        if (this._paidStatus === 'PAID') {
            params.is_paid = true;
        }
        if (this._paidStatus === 'NOT_PAID') {
            params.is_not_paid = true;
        }
        // if (formValue.min_amount) {
        //     params.min_amount = formValue.min_amount;
        // }
        // if (formValue.max_amount) {
        //     params.max_amount = formValue.max_amount;
        // }
        // if (formValue.is_paid) {
        //     params.is_paid = formValue.is_paid;
        // }
        // if (formValue.is_not_paid) {
        //     params.is_not_paid = formValue.is_not_paid;
        // }
        params.page = this.currentPage;
        return params;
    }

    private _getList() {
        const params = this._createSearchParams();
        const sub = this._debt$.getList(params).subscribe((res) => {
            this.isPageLoaded = true;
            this.dataTotal = res.data?.total || 0;
            this.dataList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public onPageChanged(page: number) {
        this.currentPage = page;
        this._getList();
    }

    public toggleAll() {
        const isAllChecked = this.isAllChecked;
        this.dataList = this.dataList.map((item) => ({ ...item, is_checked: !isAllChecked }));
    }

    public onSearch() {
        this.currentPage = 1;
        this._getList();
    }

    public showDetail(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this.modal$.open(DebtDetailComponent, { centered: true, size: 'lg' });
        const cmpIns = modal.componentInstance as DebtDetailComponent;
        cmpIns.id = this.dataList[idx].id;
        const sub = cmpIns.reloadParentList.subscribe(() => this._getList());
        this._subscription.add(sub);
    }

    public onExportExcel() {
        const params = this._createSearchParams();
        const sub = this._debt$.getList({ ...params, page: -1 }).subscribe((res) => {
            if (!res.isSuccess || !res.data || !this.helpers.isFilledArray(res.data.list)) {
                const errMsg = String(this.translate$.instant(`message.${res.message}`));
                this.toast$.error(errMsg);
                return;
            }

            const completedStr = String(this.translate$.instant('label.completed'));
            const notCompletedStr = String(this.translate$.instant('label.not_completed'));

            const excelDataList = res.data.list.map((item) => [
                String(item.id),
                String(item.payer_name),
                String(item.bank_account_number),
                String(this.helpers.formatDate(item.created_date, 'DD/MM/YYYY HH:mm:ss')),
                String(item.remind_count),
                String((item.paid_amount || 0) >= item.amount ? completedStr : notCompletedStr),
            ]);
            const data = [['Mã công nợ', 'Tên người trả', 'Số tài khoản', 'Ngày tạo', 'Số lần nhắc', 'Trạng thái'], ...excelDataList];
            const worksheet = XLSX.utils.aoa_to_sheet(data);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách công nợ');

            const outputFileName = 'TienVe.xlsx';

            XLSX.writeFile(workbook, outputFileName);

            const successMsg = String(this.translate$.instant('message.export_file_successfully'));
            this.toast$.success(successMsg);
        });
        this._subscription.add(sub);
    }

    public openDateRangePickerModal() {
        const modal = this.modal$.open(DateRangePickerModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as DateRangePickerModalComponent;
        cmpIns.title = 'Ngày tạo công nợ';
        cmpIns.startDate = this._startDate;
        cmpIns.endDate = this._endDate;
        const sub = cmpIns.confirmEvent.subscribe((value) => {
            this._startDate = value.start;
            this._endDate = value.end;
            this._getList();
        });
        this._subscription.add(sub);
    }

    public openFilterModal() {
        const modal = this.modal$.open(RadioModalComponent, { centered: true, size: 'sm' });
        const cmpIns = modal.componentInstance as RadioModalComponent;
        cmpIns.itemList = [
            {
                id: `NOT_PAID_${this.randomStr}`,
                value: 'NOT_PAID',
                label: String(this.translate$.instant('label.not_completed')),
                is_checked: this._paidStatus === 'NOT_PAID',
            },
            {
                id: `PAID_${this.randomStr}`,
                value: 'PAID',
                label: String(this.translate$.instant('label.completed')),
                is_checked: this._paidStatus === 'PAID',
            },
            {
                id: `ALL_${this.randomStr}`,
                value: 'ALL',
                label: String(this.translate$.instant('label.all')),
                is_checked: this._paidStatus === 'ALL',
            },
        ];
        cmpIns.title = 'Bộ lọc trạng thái';
        cmpIns.message = String(this.translate$.instant('label.status'));
        const sub = cmpIns.confirmEvent.subscribe((val) => {
            this._paidStatus = val as DebtPaidStatus;
            this._getList();
        });
        this._subscription.add(sub);
    }

    public openSendMessageModal() {
        const modal = this.modal$.open(SendRemindMessageModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as SendRemindMessageModalComponent;
        cmpIns.checkedList = this.dataList.filter((item) => item.is_checked);
        const sub = cmpIns.resultEvent.subscribe(() => this._getList());
        this._subscription.add(sub);
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

        const result = await this._debt$.deleteMultiple(idList);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this._getList();
    }

    public onCreate() {
        const modal = this.modal$.open(DebtCreateComponent, { centered: true, size: 'lg' });
        const cmpIns = modal.componentInstance as DebtCreateComponent;
        const sub = cmpIns.resultEvent.subscribe(() => this._getList());
        this._subscription.add(sub);
    }

    public onDelete(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        this.showConfirmModal(String(this.translate$.instant('message.confirm_delete')), {
            confirmEvent: (isConfirmed) => {
                if (!isConfirmed) return;

                void this._delete(idx);
            },
        });
    }

    private async _delete(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const result = await this._debt$.deleteMultiple([this.dataList[idx].id]);
        if (!result.isSuccess) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.delete_successfully'));
        this.toast$.success(successMsg);

        this._getList();
    }

    public onViewDetail(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this.modal$.open(DebtDetailComponent, { centered: true, size: 'lg' });
        const cmpIns = modal.componentInstance as DebtDetailComponent;
        cmpIns.id = this.dataList[idx].id;
    }
}
