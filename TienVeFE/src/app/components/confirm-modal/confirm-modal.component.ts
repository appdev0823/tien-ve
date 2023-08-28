import { Component, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
    @Input() message = '';
    @Input() confirmEvent = new EventEmitter<boolean>();

    /** Constructor */
    constructor(public activeModal: NgbActiveModal) {}

    /**
     * On user confirm
     */
    public onConfirm() {
        this.activeModal.close();
        this.confirmEvent.emit(true);
    }

    /**
     * On user close
     */
    public onClose() {
        this.activeModal.close();
        this.confirmEvent.emit(false);
    }
}
