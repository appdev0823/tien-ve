import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BaseComponent from 'src/app/includes/base.component';
import { SelectInputModalItem } from 'src/app/utils/types';

@Component({
    selector: 'app-select-input-modal',
    templateUrl: './select-input-modal.component.html',
})
export class SelectInputModalComponent extends BaseComponent {
    @Input({ required: true }) itemList: SelectInputModalItem[] = [];
    @Input({ required: true }) title = '';
    @Input() message = '';
    @Input() selectedId?: number | string;

    @Output() confirmEvent = new EventEmitter<typeof this.selectedId>();

    public selectedValue = '';

    constructor(public activeModel: NgbActiveModal) {
        super();
    }

    public onConfirm() {
        this.confirmEvent.emit(this.selectedId);
        this.activeModel.close();
    }
}
