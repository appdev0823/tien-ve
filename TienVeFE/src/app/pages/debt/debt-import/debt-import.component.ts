import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppToastService } from 'src/app/components/app-toast/app-toast.service';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { BankAccountDTO } from 'src/app/dtos';
import { SaveDebtDTO } from 'src/app/dtos/debt.dto';
import PageComponent from 'src/app/includes/page.component';
import { BankAccountService, DebtService } from 'src/app/services';
import { UploadFile } from 'src/app/utils/types';
import { DebtValidator } from 'src/app/validators/debt.validator';

@Component({
    selector: 'app-debt-import',
    templateUrl: './debt-import.component.html',
    styleUrls: ['./debt-import.component.scss'],
})
export class DebtImportComponent extends PageComponent implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    public validator = new DebtValidator();

    public bankAccountList: BankAccountDTO[] = [];

    /** Danh sách dòng dữ liệu thu được từ file Excel được upload cùng với các flags đánh dấu dữ liệu có bị lỗi hay không */
    public excelDebtList: (SaveDebtDTO & {
        invalid_keys?: {
            [K in keyof SaveDebtDTO]: boolean;
        };
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

    @ViewChild('uploadInput') private _uploadInput?: UploadComponent;

    constructor(private _bankAccount$: BankAccountService, private _debt$: DebtService) {
        super();
    }

    ngOnInit() {
        this._getList();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
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

                return item;
            });

        for (let idx = 0; idx < this.excelDebtList.length; idx++) {
            const errList = this.validator.validateOne(this.excelDebtList[idx]);
            if (errList.length > 0) {
                this.rowMessageListMap.set(idx, errList);
            }
        }
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

    public async onSubmit() {
        this.rowMessageListMap.clear();
        for (let idx = 0; idx < this.excelDebtList.length; idx++) {
            const errList = this.validator.validateOne(this.excelDebtList[idx]);
            if (errList.length > 0) {
                this.rowMessageListMap.set(idx, errList);
            }
        }
        if (this.rowMessageListMap.size > 0) return;

        const result = await this._debt$.createMultiple(this.excelDebtList);
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
    }
}
