import { Component } from '@angular/core';
import BaseComponent from 'src/app/includes/base.component';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent extends BaseComponent {
    /** Constructor */
    constructor() {
        super();
    }
}
