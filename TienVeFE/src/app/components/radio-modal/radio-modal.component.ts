import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BaseComponent from 'src/app/includes/base.component';
import { RadioModalItem } from 'src/app/utils/types';

@Component({
    selector: 'app-radio-modal',
    templateUrl: './radio-modal.component.html',
    styleUrls: ['./radio-modal.component.scss'],
})
export class RadioModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) itemList: RadioModalItem[] = [];
    @Input({ required: true }) title = '';
    @Input() message = '';

    @Output() confirmEvent = new EventEmitter<string>();

    public selectedValue = '';

    constructor(public activeModel: NgbActiveModal) {
        super();
    }

    ngOnInit() {
        const selected = this.itemList.find((item) => item.is_checked);
        if (selected) this.selectedValue = selected.value;
    }

    public onConfirm() {
        this.confirmEvent.emit(this.selectedValue);
        this.activeModel.close();
    }
}
