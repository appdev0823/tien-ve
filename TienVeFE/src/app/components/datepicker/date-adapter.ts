import { Injectable } from '@angular/core';
import { NgbDate, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from 'src/app/utils';

@Injectable()
export class MDateAdapter extends NgbDateAdapter<NgbDateStruct> {
    readonly DELIMITER = '/';

    fromModel(value: NgbDateStruct | null): NgbDateStruct | null {
        return value;
    }

    toModel(date: NgbDateStruct): NgbDateStruct {
        return { ...date };
    }
}
