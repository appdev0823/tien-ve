import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration } from 'chart.js';
import { Subscription, debounceTime } from 'rxjs';
import { DateRangePickerModalComponent } from 'src/app/components/date-range-picker-modal/date-range-picker-modal.component';
import { RadioModalComponent } from 'src/app/components/radio-modal/radio-modal.component';
import { BankAccountDTO, MessageAmountStatsDTO, MessageStatsQuery } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, MessageService } from 'src/app/services';
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

    public chartOpts: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
    };

    private _monthlyStatsStartDate: NgbDate;
    private _monthlyStatsEndDate: NgbDate;
    public monthlyAmountStatsList: MessageAmountStatsDTO[] = [];
    public monthlyAmountStatsData: ChartConfiguration<'bar'>['data'] = {
        datasets: [
            {
                data: [],
                backgroundColor: this.CONSTANTS.PRIMARY_COLOR,
                borderWidth: 0,
                borderRadius: 5,
                borderSkipped: false,
            },
        ],
        labels: [],
    };
    public currentMonthStats = {
        total_amount: 0,
        pre_diff: {
            percent: 0,
            is_increase: true,
        },
    };

    private _dailyStatsStartDate: NgbDate;
    private _dailyStatsEndDate: NgbDate;
    public dailyAmountStatsList: MessageAmountStatsDTO[] = [];
    public dailyAmountStatsData: ChartConfiguration<'bar'>['data'] = {
        datasets: [
            {
                data: [],
                backgroundColor: this.CONSTANTS.PRIMARY_COLOR,
                borderWidth: 0,
                borderRadius: 5,
                borderSkipped: false,
            },
        ],
        labels: [],
    };
    public currentDayStats = {
        total_amount: 0,
        pre_diff: {
            percent: 0,
            is_increase: true,
        },
    };

    constructor(private _bankAccount$: BankAccountService, private _message$: MessageService) {
        super();

        this._monthlyStatsStartDate = new NgbDate(this.curDate.getFullYear(), 1, 1);
        this._monthlyStatsEndDate = new NgbDate(this.curDate.getFullYear(), 12, 31);
        this._dailyStatsStartDate = new NgbDate(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 1);
        this._dailyStatsEndDate = new NgbDate(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 30);
    }

    ngOnInit() {
        this._getBankAccList();

        const sub = this.bankAccSearchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => this._getBankAccList());
        this._subscription.add(sub);

        this._getAmountMonthlyStats();
        this._getAmountDailyStats();
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

    public openMonthlyStatsDateRangeModal() {
        const modal = this.modal$.open(DateRangePickerModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as DateRangePickerModalComponent;
        cmpIns.title = 'Phát sinh trong tháng';
        cmpIns.startDate = this._monthlyStatsStartDate;
        cmpIns.endDate = this._monthlyStatsEndDate;
        cmpIns.clearable = false;
        const sub = cmpIns.confirmEvent.subscribe((value) => {
            if (value.start && value.end) {
                this._monthlyStatsStartDate = value.start;
                this._monthlyStatsEndDate = value.end;
            }
            this._getAmountMonthlyStats();
        });
        this._subscription.add(sub);
    }

    private _getAmountMonthlyStats() {
        const params: MessageStatsQuery = {
            start_date: this.helpers.convertNgbDateToDayJS(this._monthlyStatsStartDate).startOf('month').format('YYYY-MM-DD'),
            end_date: this.helpers.convertNgbDateToDayJS(this._monthlyStatsEndDate).endOf('month').format('YYYY-MM-DD'),
        };
        const sub = this._message$.getAmountMonthlyStats(params).subscribe((res) => {
            this.monthlyAmountStatsList = res.data || [];
            this.monthlyAmountStatsData = {
                datasets: [
                    {
                        data: this.monthlyAmountStatsList.map((item) => item.total_amount),
                        backgroundColor: this.CONSTANTS.PRIMARY_COLOR,
                        borderWidth: 0,
                        borderRadius: 5,
                        borderSkipped: false,
                    },
                ],
                labels: this.monthlyAmountStatsList.map((item) => item.time),
            };
            this._setCurrentMonthStats();
        });
        this._subscription.add(sub);
    }

    private _setCurrentMonthStats() {
        const curMonth = this.helpers.formatDate(this.curDate, 'MM/YYYY');
        const foundIdx = this.monthlyAmountStatsList.findIndex((item) => item.time === curMonth);
        if (foundIdx < 0) return;

        const cur = this.monthlyAmountStatsList[foundIdx];
        const pre = foundIdx > 1 ? this.monthlyAmountStatsList[foundIdx - 1] : null;
        this.currentMonthStats = {
            total_amount: cur.total_amount,
            pre_diff: {
                percent: pre ? (pre.total_amount || cur.total_amount ? Math.abs((cur.total_amount / pre.total_amount) * 100 - 100) : 0) : 0,
                is_increase: cur.total_amount > (pre?.total_amount || 0),
            },
        };
    }

    public openDailyStatsDateRangeModal() {
        const modal = this.modal$.open(DateRangePickerModalComponent, { centered: true });
        const cmpIns = modal.componentInstance as DateRangePickerModalComponent;
        cmpIns.title = 'Phát sinh trong ngày';
        cmpIns.startDate = this._dailyStatsStartDate;
        cmpIns.endDate = this._dailyStatsEndDate;
        cmpIns.clearable = false;
        const sub = cmpIns.confirmEvent.subscribe((value) => {
            if (value.start && value.end) {
                this._dailyStatsStartDate = value.start;
                this._dailyStatsEndDate = value.end;
            }
            this._getAmountDailyStats();
        });
        this._subscription.add(sub);
    }

    private _getAmountDailyStats() {
        const params: MessageStatsQuery = {
            start_date: this.helpers.convertNgbDateToDayJS(this._dailyStatsStartDate).format('YYYY-MM-DD'),
            end_date: this.helpers.convertNgbDateToDayJS(this._dailyStatsEndDate).format('YYYY-MM-DD'),
        };
        const sub = this._message$.getAmountDailyStats(params).subscribe((res) => {
            this.dailyAmountStatsList = res.data || [];
            this.dailyAmountStatsData = {
                datasets: [
                    {
                        data: this.dailyAmountStatsList.map((item) => item.total_amount),
                        backgroundColor: this.CONSTANTS.PRIMARY_COLOR,
                        borderWidth: 0,
                        borderRadius: 5,
                        borderSkipped: false,
                    },
                ],
                labels: this.dailyAmountStatsList.map((item) => item.time),
            };
            this._setCurrentDayStats();
        });
        this._subscription.add(sub);
    }

    private _setCurrentDayStats() {
        const curDay = this.helpers.formatDate(this.curDate, 'DD/MM/YYYY');
        const foundIdx = this.dailyAmountStatsList.findIndex((item) => item.time === curDay);
        if (foundIdx < 0) return;

        const cur = this.dailyAmountStatsList[foundIdx];
        const pre = foundIdx > 1 ? this.dailyAmountStatsList[foundIdx - 1] : null;
        this.currentDayStats = {
            total_amount: cur.total_amount,
            pre_diff: {
                percent: pre ? (pre.total_amount || cur.total_amount ? Math.abs((cur.total_amount / pre.total_amount) * 100 - 100) : 0) : 0,
                is_increase: cur.total_amount > (pre?.total_amount || 0),
            },
        };
    }
}
