import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgChartsModule } from 'ng2-charts';
import { NgxPrintModule } from 'ngx-print';

/**
 * This module stores all external modules, libraries, components,...
 *
 * The purpose is to minimize importing codes when other modules of the application need to use some common sets of imports
 */
@NgModule({
    declarations: [],
    imports: [CommonModule, FormsModule, TranslateModule.forChild(), NgbModule, FontAwesomeModule, NgChartsModule, NgSelectModule, NgxPrintModule, NgOtpInputModule, QRCodeModule],
    exports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        NgbModule,
        RouterModule,
        FontAwesomeModule,
        NgChartsModule,
        NgSelectModule,
        NgxPrintModule,
        NgOtpInputModule,
        QRCodeModule,
    ],
})
export class SharedModule {}
