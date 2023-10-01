import { Pipe, PipeTransform } from '@angular/core';
import { Helpers } from '../utils';

@Pipe({
    name: 'accountNumber',
})
export class AccountNumberPipe implements PipeTransform {
    transform(accountNumber: string | null | undefined) {
        if (!Helpers.isString(accountNumber)) return accountNumber;

        const numberPerPart = 4;
        let start = 0;
        const partList: string[] = [];
        while (start < accountNumber.length) {
            partList.push(accountNumber.substring(start, start + numberPerPart));
            start += numberPerPart;
        }

        return String(partList.reduce((preValue, curItem) => preValue.concat(`${curItem} `), '')).trim();
    }
}
