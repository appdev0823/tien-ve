/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from 'src/app/utils';

@Injectable()
export class MDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct | null {
        if (Helpers.isString(value)) {
            const date = value.split(this.DELIMITER);
            if (date.length < 3) return null;

            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10),
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null) {
        if (!date) return '';
        return Helpers.formatDate(Helpers.convertNgbDateToDate(date));
    }
}
