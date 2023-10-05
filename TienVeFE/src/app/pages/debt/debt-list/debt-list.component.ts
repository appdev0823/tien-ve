import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DebtDTO, DebtSearchQuery } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { DebtService } from 'src/app/services';
import { DebtDetailComponent } from '../debt-detail/debt-detail.component';

@Component({
    selector: 'app-debt-list',
    templateUrl: './debt-list.component.html',
    styleUrls: ['./debt-list.component.scss'],
})
export class DebtListComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public searchForm = new FormGroup({
        min_amount: new FormControl<number>(0),
        max_amount: new FormControl<number>(0),
        start_date: new FormControl<NgbDate | null>(null),
        end_date: new FormControl<NgbDate | null>(null),
        is_paid: new FormControl(false),
        is_not_paid: new FormControl(false),
    });

    public dataList: DebtDTO[] = [];
    public dataTotal = 0;

    constructor(private _debt$: DebtService) {
        super();
    }

    ngOnInit() {
        this._getList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getList() {
        const params: DebtSearchQuery = {};
        const formValue = this.searchForm.value;

        if (formValue.start_date) {
            params.start_date = `${formValue.start_date.year}-${formValue.start_date.month < 10 ? `0${formValue.start_date.month}` : formValue.start_date.month}-${formValue.start_date.day}`;
        }
        if (formValue.end_date) {
            params.end_date = `${formValue.end_date.year}-${formValue.end_date.month < 10 ? `0${formValue.end_date.month}` : formValue.end_date.month}-${formValue.end_date.day}`;
        }
        if (formValue.min_amount) {
            params.min_amount = formValue.min_amount;
        }
        if (formValue.max_amount) {
            params.max_amount = formValue.max_amount;
        }
        if (formValue.is_paid) {
            params.is_paid = formValue.is_paid;
        }
        if (formValue.is_not_paid) {
            params.is_not_paid = formValue.is_not_paid;
        }
        params.page = this.currentPage;

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

    public onSearch() {
        this.currentPage = 1;
        this._getList();
    }

    public showDetail(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this.modal$.open(DebtDetailComponent, { centered: true, size: 'lg' });
        const cmpIns = modal.componentInstance as DebtDetailComponent;
        cmpIns.id = this.dataList[idx].id;
        cmpIns.reloadParentList.subscribe(() => this._getList());
    }
}
