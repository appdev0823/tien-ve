import { Component } from '@angular/core';
import BaseComponent from 'src/app/includes/base.component';

@Component({
    selector: 'app-toast',
    templateUrl: './app-toast.component.html',
    styleUrls: ['./app-toast.component.scss'],
})
export class AppToastComponent extends BaseComponent {
    /** Constructor */
    constructor() {
        super();
    }

    /**
     * Get toast Bootstrap class
     */
    public getToastClass(toastType: 'SUCCESS' | 'ERROR' | 'INFO') {
        if (toastType === 'SUCCESS') return 'bg-success text-light';
        if (toastType === 'ERROR') return 'bg-danger text-light';
        return 'bg-primary text-light';
    }
}
