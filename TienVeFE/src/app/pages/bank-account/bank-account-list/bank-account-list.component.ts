import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import { BankAccountDTO, BankDTO } from 'src/app/dtos';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService } from 'src/app/services';
import { BankAccountSaveComponent } from '../bank-account-save/bank-account-save.component';

@Component({
    selector: 'app-bank-account-list',
    templateUrl: './bank-account-list.component.html',
    styleUrls: ['./bank-account-list.component.scss'],
})
export class BankAccountListComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public bankList: BankDTO[] = [];

    public dataList: BankAccountDTO[] = [];
    public dataTotal = 0;

    constructor(private _translate$: TranslateService, private _toast$: AppToastService, private _bankAccount$: BankAccountService, private _modal$: NgbModal) {
        super();
    }

    ngOnInit() {
        this._getList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _getList() {
        const sub = this._bankAccount$.getList({ page: this.currentPage }).subscribe((res) => {
            this.isPageLoaded = true;
            if (!res.isSuccess) {
                const errMsg = String(this._translate$.instant(`message.${res.message}`));
                this._toast$.error(errMsg);
            }

            this.dataTotal = res.data?.total || 0;
            this.dataList = res.data?.list || [];
        });
        this._subscription.add(sub);
    }

    public onCreate() {
        const modal = this._modal$.open(BankAccountSaveComponent, { centered: true });
        const cmpIns = modal.componentInstance as BankAccountSaveComponent;
        const sub = cmpIns.resultEvent.subscribe(() => {
            this._getList();
        });
        this._subscription.add(sub);
    }

    public onUpdate(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const modal = this._modal$.open(BankAccountSaveComponent, { centered: true });
        const cmpIns = modal.componentInstance as BankAccountSaveComponent;
        cmpIns.id = this.dataList[idx].id;
        const sub = cmpIns.resultEvent.subscribe(() => {
            this._getList();
        });
        this._subscription.add(sub);
    }

    public onDelete(idx: number) {
        if (idx < 0 || idx >= this.dataList.length) return;

        const confirmDeleteMsg = String(this._translate$.instant('message.confirm_delete'));
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
            const errMsg = String(this._translate$.instant(`message.${result.message}`));
            this._toast$.error(errMsg);
            return;
        }

        const successMsg = String(this._translate$.instant('message.delete_successfully'));
        this._toast$.success(successMsg);

        this._getList();
    }

    public onPageChanged(page: number) {
        this.currentPage = page;
        this._getList();
    }
}
