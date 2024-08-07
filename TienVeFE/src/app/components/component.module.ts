import { NgModule } from '@angular/core';
import { SharedModule } from '../includes/shared.module';
import { AppToastComponent } from './app-toast/app-toast.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FormInputWrapperComponent } from './form-input-wrapper/form-input-wrapper.component';
import { UploadComponent } from './upload/upload.component';
import { MessageSelectComponent } from './message-select/message-select.component';
import { RadioModalComponent } from './radio-modal/radio-modal.component';
import { UpgradeModalComponent } from './upgrade-modal/upgrade-modal.component';
import { PipeModule } from '../pipes/pipe.module';
import { DateRangePickerModalComponent } from './date-range-picker-modal/date-range-picker-modal.component';
import { DownloadAppModalComponent } from './download-app-modal/download-app-modal.component';
import { SelectInputModalComponent } from './select-input-modal/select-input-modal.component';

@NgModule({
    declarations: [
        AppToastComponent,
        FormInputWrapperComponent,
        ConfirmModalComponent,
        UploadComponent,
        MessageSelectComponent,
        RadioModalComponent,
        UpgradeModalComponent,
        DateRangePickerModalComponent,
        DownloadAppModalComponent,
        SelectInputModalComponent,
    ],
    imports: [SharedModule, PipeModule],
    exports: [
        AppToastComponent,
        FormInputWrapperComponent,
        ConfirmModalComponent,
        UploadComponent,
        MessageSelectComponent,
        RadioModalComponent,
        DateRangePickerModalComponent,
        DownloadAppModalComponent,
        SelectInputModalComponent,
    ],
})
export class ComponentModule {}
