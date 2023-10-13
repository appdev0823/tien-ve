import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import BaseComponent from 'src/app/includes/base.component';

@Component({
    selector: 'app-date-range-picker-modal',
    templateUrl: './date-range-picker-modal.component.html',
    styleUrls: ['./date-range-picker-modal.component.scss'],
})
export class DateRangePickerModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) title = '';

    @Input() startDate: NgbDateStruct | null = null;
    @Input() endDate: NgbDateStruct | null = null;

    public searchForm = new FormGroup({
        start_date: new FormControl<NgbDateStruct | null>(null),
        end_date: new FormControl<NgbDateStruct | null>(null),
    });

    @Output() confirmEvent = new EventEmitter<{
        start: NgbDate | null;
        end: NgbDate | null;
    }>();

    constructor(public activeModel: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        if (this.startDate) {
            this.searchForm.controls.start_date.setValue(NgbDate.from(this.startDate));
        }
        if (this.endDate) {
            this.searchForm.controls.end_date.setValue(NgbDate.from(this.endDate));
        }
    }

    public onClear() {
        this.searchForm.controls.start_date.setValue(null);
        this.searchForm.controls.end_date.setValue(null);
    }

    public onConfirm() {
        const formValue = this.searchForm.value;
        this.confirmEvent.emit({
            start: formValue.start_date ? new NgbDate(formValue.start_date.year, formValue.start_date.month, formValue.start_date.day) : null,
            end: formValue.end_date ? new NgbDate(formValue.end_date.year, formValue.end_date.month, formValue.end_date.day) : null,
        });
        this.activeModel.close();
    }
}
