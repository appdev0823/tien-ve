import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { BankAccountDTO } from 'src/app/dtos';
import { SaveDebtDTO } from 'src/app/dtos/debt.dto';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, DebtService, UserService } from 'src/app/services';
import { UploadFile } from 'src/app/utils/types';
import { DebtValidator } from 'src/app/validators/debt.validator';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-debt-import',
    templateUrl: './debt-import.component.html',
    styleUrls: ['./debt-import.component.scss'],
})
export class DebtImportComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public validator = new DebtValidator();

    public bankAccountList: BankAccountDTO[] = [];

    public todayDebtCount = 0;

    /** Danh sách dòng dữ liệu thu được từ file Excel được upload cùng với các flags đánh dấu dữ liệu có bị lỗi hay không */
    public excelDebtList: (SaveDebtDTO & {
        invalid_keys?: {
            [K in keyof SaveDebtDTO]: boolean;
        };
        is_checked: boolean;
    })[] = [];

    /** `Map<row_index, errorMessage[]>` chứa danh sách validation error message của từng row */
    public rowMessageListMap = new Map<number, string[]>();
    /** Danh sách validation error message (distinct) */
    public get errorMessageList() {
        const result: string[] = [];
        for (const errMsgList of this.rowMessageListMap.values()) {
            result.push(...errMsgList);
        }
        return [...new Set(result)];
    }
    public get errorCount() {
        return Array.from(this.rowMessageListMap.values()).reduce((preVal, curItem) => preVal + curItem.length, 0);
    }
    public showErrorMsgList = true;

    public get isAllChecked() {
        return this.excelDebtList.length > 0 ? this.excelDebtList.every((item) => item.is_checked) : false;
    }

    @ViewChild('uploadInput') private _uploadInput?: UploadComponent;

    constructor(private _bankAccount$: BankAccountService, private _debt$: DebtService, private _user$: UserService, private _router: Router) {
        super();
    }

    ngOnInit() {
        this._getList();
        void this._getTodayDebtCount();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private async _getTodayDebtCount() {
        const result = await this._user$.getTodayDebtCount();
        if (!result.isSuccess || !result.data) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        this.todayDebtCount = Number(result.data.count) || 0;
    }

    private _getList() {
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

    public async onExcelFileUploaded(fileList: UploadFile[]) {
        this.rowMessageListMap.clear();
        this.excelDebtList = [];

        if (fileList.length <= 0) return;

        const file = fileList[0];
        const tileRowIdx = 0;
        const dataList = await this.helpers.readExcelFile(file.file);
        dataList.splice(0, tileRowIdx + 1); // remove title row and above
        if (!this.helpers.isFilledArray(dataList)) return;

        const payerNameColIdx = 0;
        const payerPhoneColIdx = 1;
        const amountColIdx = 2;
        const bankAccountNumberColIdx = 3;
        const noteColIdx = 4;

        this.excelDebtList = dataList
            .filter((row) => this.helpers.isFilledArray(row))
            .map((row) => {
                const item = new SaveDebtDTO();
                const rowLastIdx = row.length - 1;

                if (rowLastIdx >= payerNameColIdx) {
                    item.payer_name = row[payerNameColIdx];
                }
                if (rowLastIdx >= payerPhoneColIdx) {
                    item.payer_phone = row[payerPhoneColIdx];
                }
                if (rowLastIdx >= amountColIdx) {
                    item.amount = this.helpers.extractNumberFromString(row[amountColIdx]) || 0;
                }
                if (rowLastIdx >= bankAccountNumberColIdx) {
                    const bankAccount = this.bankAccountList.find((acc) => acc.account_number === row[bankAccountNumberColIdx]);
                    if (bankAccount) {
                        item.bank_account_id = bankAccount.id;
                    }
                }
                if (rowLastIdx >= noteColIdx) {
                    item.note = row[noteColIdx];
                }

                return { ...item, is_checked: true };
            });

        this._resetDebtIds();

        this._validateExcelDebtList();
    }

    private _validateExcelDebtList() {
        this.rowMessageListMap.clear();

        for (let idx = 0; idx < this.excelDebtList.length; idx++) {
            const errList = this.validator.validateOne(this.excelDebtList[idx]);
            if (errList.length > 0) {
                this.rowMessageListMap.set(idx, errList);
            }
        }
    }

    private _resetDebtIds() {
        const { PREFIX, SEPARATOR, DATE_FORMAT, USER_ID_LENGTH, AUTO_INCREMENT_LENGTH } = this.CONSTANTS.DEBT_ID_FORMAT;
        const curDateStr = dayjs(new Date()).format(DATE_FORMAT);
        const paddedUserId = this.helpers.padLeft(this.currentUser.id, USER_ID_LENGTH);
        const idLeftPartStr = `${PREFIX}${SEPARATOR}${curDateStr}${SEPARATOR}${paddedUserId}${SEPARATOR}`; // TV-DDMMYY-0000X-

        this.excelDebtList.forEach((item, idx) => {
            item.id = `${idLeftPartStr}${this.helpers.padLeft(idx + this.todayDebtCount + 1, AUTO_INCREMENT_LENGTH)}`;
        });
    }

    public onPayerNameChanged(event: Event, idx: number) {
        if (idx < 0 || idx >= this.excelDebtList.length) return;

        const input = event.target as HTMLInputElement;
        const value = input.value;

        this.excelDebtList[idx].payer_name = value;

        const errMsgList = this.validator.validateOne(this.excelDebtList[idx]);
        if (!this.helpers.isFilledArray(errMsgList)) {
            this.rowMessageListMap.delete(idx);
            return;
        }
        this.rowMessageListMap.set(idx, errMsgList);
    }

    public onPayerPhoneChanged(event: Event, idx: number) {
        if (idx < 0 || idx >= this.excelDebtList.length) return;

        const input = event.target as HTMLInputElement;
        const value = input.value;

        this.excelDebtList[idx].payer_phone = value;

        const errMsgList = this.validator.validateOne(this.excelDebtList[idx]);
        if (!this.helpers.isFilledArray(errMsgList)) {
            this.rowMessageListMap.delete(idx);
            return;
        }
        this.rowMessageListMap.set(idx, errMsgList);
    }

    public onAmountChanged(event: Event, idx: number) {
        if (idx < 0 || idx >= this.excelDebtList.length) return;

        const input = event.target as HTMLInputElement;
        const value = input.value;

        this.excelDebtList[idx].amount = this.helpers.extractNumberFromString(value);

        const errMsgList = this.validator.validateOne(this.excelDebtList[idx]);
        if (!this.helpers.isFilledArray(errMsgList)) {
            this.rowMessageListMap.delete(idx);
            return;
        }
        this.rowMessageListMap.set(idx, errMsgList);
    }

    public onBankAccountChanged(idx: number) {
        if (idx < 0 || idx >= this.excelDebtList.length) return;

        const errMsgList = this.validator.validateOne(this.excelDebtList[idx]);
        if (!this.helpers.isFilledArray(errMsgList)) {
            this.rowMessageListMap.delete(idx);
            return;
        }
        this.rowMessageListMap.set(idx, errMsgList);
    }

    public toggleAll() {
        const isAllChecked = this.isAllChecked;
        this.excelDebtList = this.excelDebtList.map((item) => ({ ...item, is_checked: !isAllChecked }));
    }

    public removeCheckedList() {
        this.excelDebtList = this.excelDebtList.filter((item) => !item.is_checked);
        this._resetDebtIds();
        this._validateExcelDebtList();
    }

    public async onSubmit() {
        const checkedList = this.excelDebtList.filter((item) => item.is_checked);
        if (checkedList.length <= 0 || this.rowMessageListMap.size > 0) return;

        this.rowMessageListMap.clear();
        for (let idx = 0; idx < checkedList.length; idx++) {
            const errList = this.validator.validateOne(checkedList[idx]);
            if (errList.length > 0) {
                this.rowMessageListMap.set(idx, errList);
            }
        }
        if (this.rowMessageListMap.size > 0) return;

        const result = await this._debt$.createMultiple(checkedList);
        if (!result.isSuccess || !this.helpers.isFilledArray(result.data?.list)) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const successMsg = String(this.translate$.instant('message.save_successfully'));
        this.toast$.success(successMsg);

        this.rowMessageListMap.clear();
        this.excelDebtList = [];
        this._uploadInput?.reset();

        const debtListRoute = `/${this.ROUTES.DEBT.MODULE}/${this.ROUTES.DEBT.LIST}`;
        await this._router.navigate([debtListRoute]);
    }
}
